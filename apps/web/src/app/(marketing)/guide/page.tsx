import { TypographyH2, TypographyP } from '@repo/ui/typography';
import Image from 'next/image';

const UserGuide = () => {
    return (
        <div className="flex-col mx-5 min-h-screen mt-5 sm:mt-0 max-w-screen-xl items-center justify-between xl:mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-2xl p-12 w-full py-16">
                <div className="rounded-2xl bg-gradient-to-t from-red-700 to-red-900 p-4 border-none outline-none sm:p-8">
                    <Image src={"/_static/att_report.png"} width={500} height={500} alt="Attendance Report" className="w-full h-full rounded-2xl" />
                </div>
                <div className="mt-4">
                    <h1 className={'text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-left mb-8 max-w-screen-md'}>
                        How to use trackit
                    </h1>
                    <p className={'text-lg sm:text-xl md:text-2xl text-muted-foreground mb-12 text-left max-w-screen-md'}>
                        1. Add Trackit extension to your favourite browser from Trackit website homepage.<br />
                        2. Sign up on trackit website.<br />
                        3. Enjoy your meet without taking tension of attendance.<br />
                        4. As your meet ends we will show you the attendance report automatically.<br />
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-2xl p-12 w-full py-16">
                <div className='text-left'>
                    <TypographyH2>How to fix errors</TypographyH2>
                    <TypographyP>In this video I have discussed how the extension works and how to fix various errors which can occur.</TypographyP>
                </div>
                <div>
                    <div className='relative pb-[56.25%]'><iframe src="https://www.youtube.com/embed/nCtUS-FPOxA" title="Bug Squashing : Fixing Errors in Trackit" allowFullScreen className="absolute t-0 l-0 w-full h-full"></iframe></div>
                </div>
            </div>
        </div>
    )
}

export default UserGuide;