import Layout from '@/components/layout';

const PrivacyPolicy=() => {
    return (
        <Layout>
            <div className="flex mx-5 h-screen max-w-screen-xl items-center justify-between xl:mx-auto">
                <div className="mt-4">
                    <h1 className={`text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-black dark:text-white text-left mb-8 max-w-screen-md`}>
                        Privacy Policy
                    </h1>
                    <p className={`text-lg sm:text-xl md:text-2xl text-gray-500 dark:text-gray-200 mb-12 text-left dark:text-white-200`}>
                        Our extension utilises browser local storage to store meet data. It&apos;s stored there until you login to our website.
                        For authenticated users attendance is stored in secured database.
                        We only record attendees name, time they joined, for how long they were present and when they left the meeting.
                        We don&apos;t share your data with anyone. You have total control over all your data.
                    </p>
                </div>
            </div>
        </Layout>
    )
}

export default PrivacyPolicy;