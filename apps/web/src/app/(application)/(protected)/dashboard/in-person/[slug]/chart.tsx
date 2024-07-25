"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
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
} from "@repo/ui/chart";
import { Point } from "@/types";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "red", "pink"];

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

import { calculateDistance } from "@/lib/api/in-person/location";
import { formatDistance } from "@/lib/utils/format";
import { TypographyP } from "@repo/ui/typography";
import { Circle } from "lucide-react";

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
        }).toFixed(3)
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

  console.log(data);

  return (
    <div className="flex-1 flex items-center justify-center">
      <Card>
        <CardHeader className="items-center pb-4">
          <CardTitle>Attendees Graph</CardTitle>
          <CardDescription>
            Showing attendees location relative to event location.
          </CardDescription>
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
                      console.log(payload);
                      if (payload.length > 0) {
                        return (
                          <div className="space-y-1">
                            <p>
                              {payload[0]!.payload.name}
                            </p>
                            {!payload[0]!.payload.center && (
                              <p>
                                Distance{" "}
                                {formatDistance(
                                  payload[0]!.payload.distance as number
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
              <Scatter name="Attendees" data={data} fill="var(--color-x)">
                {data.map((value, index) => (
                  <Cell key={index} fill={value.center ? "red" : "var(--color-x)"} />
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
