"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  ReferenceArea,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/chart";
import { Point } from "@/types";
import { Circle, X } from "lucide-react";
import { calculateDistance } from "@/lib/api/in-person/location";
import { formatDistance } from "@/lib/utils/format";
import { useState } from "react";
import { CategoricalChartState } from "recharts/types/chart/types";
import { Button } from "@repo/ui/button";

const chartConfig = {
  x: {
    label: "Latitude",
    color: "hsl(var(--chart-1))",
  },
  y: {
    label: "Latitude",
    color: "hsl(var(--chart-2))",
  },
  name: {
    label: "Name",
    color: "hsl(var(--chart-3))",
  },
  distance: {
    label: "Distance",
    color: "hsl(var(--chart-4)",
  },
} satisfies ChartConfig;

const MIN_ZOOM = 0.0001;

export default function InPersonEventAttendanceGraph({
  center,
  attendees,
}: {
  center: Point;
  attendees: {
    name: string;
    location: Point;
  }[];
}) {
  const data: {
    x: number;
    y: number;
    name: string;
    distance: number;
    center?: boolean;
  }[] = [];

  attendees.forEach(({ name, location }) => {
    data.push({
      x: parseFloat(location.x.toFixed(2)),
      y: parseFloat(location.y.toFixed(2)),
      name: name,
      distance: parseFloat(
        calculateDistance({
          location1: { lat: location.x, lng: location.y },
          location2: {
            lat: center.x,
            lng: center.y,
          },
        }).toFixed(3),
      ),
    });
  });

  data.push({
    x: parseFloat(center.x.toFixed(2)),
    y: parseFloat(center.y.toFixed(2)),
    name: "Event Location",
    distance: 0,
    center: true,
  });

  const [filteredData, setFilteredData] = useState(data);
  const [zoomArea, setZoomArea] = useState<{
    x1: number;
    x2: number;
    y1: number;
    y2: number;
  } | null>(null);
  const [isZooming, setIsZooming] = useState(false);
  const isZoomed = filteredData.length !== data.length;

  const showZoomBox =
    isZooming &&
    zoomArea !== null &&
    !(Math.abs(zoomArea.x1 - zoomArea.x2) < MIN_ZOOM) &&
    !(Math.abs(zoomArea.y1 - zoomArea.y2) < MIN_ZOOM);

  const handleZoomOut = () => {
    setFilteredData(data);
    setZoomArea(null);
  };

  const handleMouseDown = (e: CategoricalChartState) => {
    setIsZooming(true);
    const { xValue, yValue } = e;
    if (xValue && yValue)
      setZoomArea({ x1: xValue, y1: yValue, x2: xValue, y2: yValue });
  };

  const handleMouseMove = (e: CategoricalChartState) => {
    if (isZooming) {
      setZoomArea((prev) => {
        if (prev && e.xValue && e.yValue) {
          return { ...prev, x2: e.xValue, y2: e.yValue };
        }
        return prev;
      });
    }
  };

  const handleMouseUp = (e: CategoricalChartState) => {
    if (isZooming && zoomArea) {
      setIsZooming(false);
      let { x1, y1, x2, y2 } = zoomArea;

      // ensure x1 <= x2 and y1 <= y2
      if (x1 > x2) [x1, x2] = [x2, x1];
      if (y1 > y2) [y1, y2] = [y2, y1];

      if (!(x2 - x1 < MIN_ZOOM || y2 - y1 < MIN_ZOOM)) {
        const dataPointsInRange = filteredData.filter(
          (d) => d.x >= x1 && d.x <= x2 && d.y >= y1 && d.y <= y2,
        );
        if (dataPointsInRange.length === 0) {
          setFilteredData(data);
        } else {
          setFilteredData(dataPointsInRange);
        }
        setZoomArea(null);
      }
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center">
      <Card>
        <CardHeader className="items-center pb-4">
          <CardTitle>Attendees Graph</CardTitle>
          <CardDescription>
            Showing attendees location relative to event location.
          </CardDescription>
          {isZoomed && (
            <Button variant={"secondary"} onClick={handleZoomOut}>
              Zoom Out
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-96"
          >
            <ScatterChart
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              <CartesianGrid />
              <XAxis
                type="number"
                tick={false}
                hide
                domain={["dataMin-1", "dataMax+1"]}
                name="Latitude"
                dataKey={"x"}
                unit={"°"}
                minTickGap={0.01}
              />
              <YAxis
                type="number"
                tick={false}
                hide
                domain={["dataMin-1", "dataMax+1"]}
                name="Longitude"
                dataKey={"y"}
                unit="°"
                minTickGap={0.01}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value, payload) => {
                      if (payload.length > 0) {
                        return (
                          <div className="space-y-1">
                            <p>{payload[0]!.payload.name}</p>
                            {!payload[0]!.payload.center && (
                              <p>
                                Distance{" "}
                                {formatDistance(
                                  payload[0]!.payload.distance as number,
                                )}
                              </p>
                            )}
                          </div>
                        );
                      }
                      return value;
                    }}
                  />
                }
              />
              {showZoomBox && (
                <ReferenceArea
                  x1={zoomArea?.x1}
                  x2={zoomArea?.x2}
                  y1={zoomArea?.y1}
                  y2={zoomArea?.y2}
                />
              )}
              <Scatter
                name="Attendees"
                data={filteredData}
                fill="var(--color-x)"
              >
                {filteredData.map((value, index) => (
                  <Cell
                    key={index}
                    fill={value.center ? "red" : "var(--color-x)"}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex gap-2 text-sm text-muted-foreground items-center justify-center">
          <div className="flex gap-2 items-center justify-center">
            <Circle className="h-2 w-2" color="red" fill="red" />
            <span>Event Location</span>
          </div>
          <div className="flex gap-2 items-center justify-center">
            <Circle
              className="h-2 w-2"
              color="hsl(var(--chart-1))"
              fill="hsl(var(--chart-1))"
            />
            <span>Participant</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
