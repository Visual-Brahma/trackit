import Layout from '@/components/layout';
import Image from 'next/image';
import attendanceReport from '@/assets/att_report.png';

const UserGuide=() => {
    return (
        <Layout>
            <div className="flex mx-5 h-screen max-w-screen-xl items-center justify-between xl:mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-2xl p-12 w-full py-16">
                    <div className="rounded-2xl bg-gradient-to-t from-red-700 to-red-900 p-4 border-none outline-none sm:p-8">
                        <Image src={attendanceReport} alt="Attendance Report" className="w-full h-full rounded-2xl" />
                    </div>
                    <div className="mt-4">
                        <h1 className={`text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-black dark:text-white text-left mb-8 max-w-screen-md`}>
                            How to use trackit
                        </h1>
                        <p className={`text-lg sm:text-xl md:text-2xl text-gray-500 dark:text-gray-200 mb-12 text-left max-w-screen-md dark:text-white-200`}>
                            1. Add Trackit extension to your favourite browser from Trackit website homepage.<br />
                            2. Sign up on trackit website.<br />
                            3. Enjoy your meet without taking tension of attendance.<br />
                            4. As your meet ends we will show you the attendance report automatically.<br />
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default UserGuide;