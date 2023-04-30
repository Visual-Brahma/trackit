import Layout from '@/components/layout';
import Image from 'next/image';
import chromeExtension from '@/assets/chrome_ext.png';
import attendanceReport from '@/assets/att_report.png';
import { useRouter } from 'next/router';
import { ChangeEvent } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

const Home=() => {
    const router=useRouter();
    const { data: session }=useSession();
    return (
        <Layout>
            <div className={`flex flex-col items-center justify-center h-screen`}>
                <h1 className={`text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-black dark:text-white text-center mb-8 max-w-screen-md`}>
                    The Attendance Tracker tool you’ll enjoy using
                </h1>
                <p className={`text-lg sm:text-xl md:text-2xl text-gray-500 dark:text-gray-200 text-center mb-12 max-w-screen-sm`}>
                    Automatically track attendance for your Google Meet meetings and get detailed reports on who attended and how much.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-2xl p-8">
                    <button className="button-large" onClick={() => (session? router.push("/app"):signIn())}>
                        {session? 'Dashboard':'Get Started'}
                    </button>
                    <select className="button-large border-black" onChange={(event: ChangeEvent<HTMLSelectElement>) => { router.push(event.target.value); }}>
                        <option className="text-black" value="#">Get Free Extension</option>
                        <option className="text-black" value="https://microsoftedge.microsoft.com/addons/detail/trackit-meet-attendance/chidnckliojipjihhfmjdmehaglhplcl">Microsoft Edge</option>
                        <option className="text-black" value="https://chrome.google.com/webstore/detail/trackit-meet-attendance-c/aopejafeamijmefcoclhohoaggbfhcgh/related?utm_source=googleads&utm_medium=adgroup5&utm_campaign=adgroup5&utm_id=adgroup5&gclid=CjwKCAiAprGRBhBgEiwANJEY7D9D94sOFqe-yMI3iC5c-1iZOiMusn6quP52k1Epv8puiQyZ8BxEWxoCk9EQAvD_BwE">Google Chrome</option>
                        <option className="text-black" value="https://addons.mozilla.org/en-US/firefox/addon/trackit">Mozilla Firefox</option>
                        <option className="text-black" value="https://chrome.google.com/webstore/detail/trackit-meet-attendance-c/aopejafeamijmefcoclhohoaggbfhcgh/related?utm_source=googleads&utm_medium=adgroup5&utm_campaign=adgroup5&utm_id=adgroup5&gclid=CjwKCAiAprGRBhBgEiwANJEY7D9D94sOFqe-yMI3iC5c-1iZOiMusn6quP52k1Epv8puiQyZ8BxEWxoCk9EQAvD_BwE">Brave</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-8 sm:p-24 bg-gray-200 dark:bg-light-gray">
                <div className="rounded-lg bg-gray-400 dark:bg-dark-gray">
                    <div className="p-8">
                        <h5 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-black dark:text-white text-left mb-8 max-w-screen-md">Fully Automatic</h5>
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-500 dark:text-gray-200 mb-12 text-left max-w-screen-md dark:text-white-200">Everything is done for you automatically. Just download trackit extension and relax.</p>
                    </div>
                </div>
                <div className="rounded-lg bg-gray-400 dark:bg-dark-gray">
                    <div className="p-8">
                        <h5 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-black dark:text-white text-left mb-8 max-w-screen-md">Secure</h5>
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-500 dark:text-gray-200 mb-12 text-left max-w-screen-md dark:text-white-200">We are working very sincerely to secure your data.</p>
                    </div>
                </div>
                <div className="rounded-lg bg-gray-400 dark:bg-dark-gray">
                    <div className="p-8">
                        <h5 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-black dark:text-white text-left mb-8 max-w-screen-md">Simple Interface</h5>
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-500 dark:text-gray-200 mb-12 text-left max-w-screen-md dark:text-white-200">Trackit is built to provide simplicity to users.</p>
                    </div>
                </div>
                <div className="rounded-lg bg-gray-400 dark:bg-dark-gray">
                    <div className="p-8">
                        <h5 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-black dark:text-white text-left mb-8 max-w-screen-md">Detailed Report</h5>
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-500 dark:text-gray-200 mb-12 text-left max-w-screen-md dark:text-white-200">Get detailed report of attendance for every google meet videocall.</p>
                    </div>
                </div>
                <div className="rounded-lg bg-gray-400 dark:bg-dark-gray">
                    <div className="p-8">
                        <h5 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-black dark:text-white text-left mb-8 max-w-screen-md">Attendance History</h5>
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-500 dark:text-gray-200 mb-12 text-left max-w-screen-md dark:text-white-200">All your attendance reports are securely stored in our database. You can access them anytime.</p>
                    </div>
                </div>
                <div className="rounded-lg bg-gray-400 dark:bg-dark-gray">
                    <div className="p-8">
                        <h5 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-black dark:text-white text-left mb-8 max-w-screen-md">Full Control</h5>
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-500 dark:text-gray-200 mb-12 text-left max-w-screen-md dark:text-white-200">You have full access to your every data saved in our database.</p>
                    </div>
                </div>
            </div>

            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-2xl p-12 py-16 w-full">
                    <div className="mt-4">
                        <h1 className={`text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-black dark:text-white text-left mb-8 max-w-screen-md`}>
                            Fully Automatic
                        </h1>
                        <p className={`text-lg sm:text-xl md:text-2xl text-gray-500 dark:text-gray-200 mb-12 text-left max-w-screen-md`}>
                            Just download the extension and we will do the rest. Everytime you join a google meet meeting, we will automatically start tracking attendance for you.
                        </p>
                    </div>
                    <div className="rounded-2xl bg-gradient-to-t from-red-700 to-red-900 p-4 border-none outline-none sm:p-8">
                        <Image src={chromeExtension} alt="Chrome Extension" className="w-full h-full rounded-2xl" />
                    </div>
                </div>

                <div className="bg-gray-200 dark:bg-light-gray grid grid-cols-1 md:grid-cols-2 gap-8 text-2xl p-12 w-full py-16">
                    <div className="rounded-2xl bg-gradient-to-t from-red-700 to-red-900 p-4 border-none outline-none sm:p-8">
                        <Image src={attendanceReport} alt="Attendance Report" className="w-full h-full rounded-2xl" />
                    </div>
                    <div className="mt-4">
                        <h1 className={`text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-black dark:text-white text-left mb-8 max-w-screen-md`}>
                            Detailed Attendance Report
                        </h1>
                        <p className={`text-lg sm:text-xl md:text-2xl text-gray-500 dark:text-gray-200 mb-12 text-left max-w-screen-md dark:text-white-200`}>
                            Get details of every participants joining time, total duration they were present for and many more features are coming soon.
                        </p>
                    </div>
                </div>
            </div>

            <div className={`flex flex-col items-center justify-center h-screen`}>
                <h1 className={`text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-black dark:text-white text-center mb-8 max-w-screen-md`}>
                    Get started with Trackit today
                </h1>
                <p className={`text-lg sm:text-xl md:text-2xl text-gray-500 dark:text-gray-200 text-center mb-12 max-w-screen-sm`}>
                    Trackit provides deep insights of the attendance of online classes with great analysis tools.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-2xl p-8">
                    <button className="button-large" onClick={() => (session? router.push("/app"):signIn())}>
                        {session? 'Dashboard':'Get Started'}
                    </button>
                    <select className="button-large border-black" onChange={(event: ChangeEvent<HTMLSelectElement>) => { router.push(event.target.value); }}>
                        <option className="text-black" value="#">Get Free Extension</option>
                        <option className="text-black" value="https://microsoftedge.microsoft.com/addons/detail/trackit-meet-attendance/chidnckliojipjihhfmjdmehaglhplcl">Microsoft Edge</option>
                        <option className="text-black" value="https://chrome.google.com/webstore/detail/trackit-meet-attendance-c/aopejafeamijmefcoclhohoaggbfhcgh/related?utm_source=googleads&utm_medium=adgroup5&utm_campaign=adgroup5&utm_id=adgroup5&gclid=CjwKCAiAprGRBhBgEiwANJEY7D9D94sOFqe-yMI3iC5c-1iZOiMusn6quP52k1Epv8puiQyZ8BxEWxoCk9EQAvD_BwE">Google Chrome</option>
                        <option className="text-black" value="https://addons.mozilla.org/en-US/firefox/addon/trackit">Mozilla Firefox</option>
                        <option className="text-black" value="https://chrome.google.com/webstore/detail/trackit-meet-attendance-c/aopejafeamijmefcoclhohoaggbfhcgh/related?utm_source=googleads&utm_medium=adgroup5&utm_campaign=adgroup5&utm_id=adgroup5&gclid=CjwKCAiAprGRBhBgEiwANJEY7D9D94sOFqe-yMI3iC5c-1iZOiMusn6quP52k1Epv8puiQyZ8BxEWxoCk9EQAvD_BwE">Brave</option>
                    </select>
                </div>
            </div>
        </Layout>
    )
}

export default Home;