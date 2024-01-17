import Image from 'next/image'
import ExtensionChooser from '@/components/extension-chooser'

const Home=() => {

  const features: { id: number, title: string; description: string }[]=[
    {
      id: 1,
      title: "Fully Automatic",
      description: "Everything is done for you automatically. Just download trackit extension and relax.",
    },
    {
      id: 2,
      title: "Secure",
      description: "We are working very sincerely to secure your data.",
    },
    {
      id: 3,
      title: "Simple Interface",
      description: "Trackit is built to provide simplicity to users.",
    },
    {
      id: 4,
      title: "Detailed Report",
      description: "Get detailed report of attendance for every google meet videocall.",
    },
    {
      id: 5,
      title: "Attendance History",
      description: "All your attendance reports are securely stored in our database. You can access them anytime.",
    },
    {
      id: 6,
      title: "Full Control",
      description: "You have full access to your every data saved in our database.",
    }
  ];
  return (
    <div className='snap-y'>
      <div className={'flex flex-col items-center justify-center h-screen snap-always snap-center'}>
        <h1
          className={
            'text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-center mb-8 max-w-screen-md'
          }
        >
          The Attendance Tracker tool you’ll enjoy using
        </h1>
        <p
          className={
            'text-lg sm:text-xl md:text-2xl text-muted-foreground text-center mb-12 max-w-screen-sm'
          }
        >
          Automatically track attendance for your Google Meet meetings and get
          detailed reports on who attended and how much.
        </p>
        <ExtensionChooser />
      </div>

      <div className='flex items-center justify-center min-h-screen snap-always snap-center'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-8 sm:p-24'>
          {
            features.map((feature) => (
              <div key={feature.title} className='rounded-lg border-border border-2 drop-shadow-2xl hover:drop-shadow-lg'>
                <div className='p-8'>
                  <h5 className='text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-left mb-8 max-w-screen-md'>
                    {feature.title}
                  </h5>
                  <p className='text-lg sm:text-xl md:text-2xl text-muted-foreground mb-12 text-left max-w-screen-md'>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      <div>
        <div className='flex items-center justify-center min-h-screen'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 text-2xl p-12 py-16 w-full'>
            <div className='mt-4'>
              <h1
                className={
                  'text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-left mb-8 max-w-screen-md'
                }
              >
                Fully Automatic
              </h1>
              <p
                className={
                  'text-lg sm:text-xl md:text-2xl text-gray-500 dark:text-gray-400 mb-12 text-left max-w-screen-md'
                }
              >
                Just download the extension and we will do the rest. Everytime you
                join a google meet meeting, we will automatically start tracking
                attendance for you.
              </p>
            </div>
            <div className='rounded-2xl bg-gradient-to-t from-red-700 to-red-900 p-4 border-none outline-none sm:p-8'>
              <Image
                src={"/_static/chrome_ext.png"}
                alt='Chrome Extension'
                width={500}
                height={500}
                sizes='100vw'
                className='w-full h-full rounded-2xl'
              />
            </div>
          </div>
        </div>

        <div className='flex items-center justify-center min-h-screen'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 text-2xl p-12 w-full py-16'>
            <div className='rounded-2xl bg-gradient-to-t from-red-700 to-red-900 p-4 border-none outline-none sm:p-8'>
              <Image
                src={"/_static/att_report.png"}
                alt='Attendance Report'
                width={500}
                height={500}
                className='w-full h-full rounded-2xl'
              />
            </div>
            <div className='mt-4'>
              <h1
                className={
                  'text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-left mb-8 max-w-screen-md'
                }
              >
                Detailed Attendance Report
              </h1>
              <p
                className={
                  'text-lg sm:text-xl md:text-2xl text-muted-foreground mb-12 text-left max-w-screen-md'
                }
              >
                Get details of every participants joining time, total duration
                they were present for and many more features are coming soon.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={'flex flex-col items-center justify-center h-screen snap-always snap-center'}>
        <h1
          className={
            'text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-center mb-8 max-w-screen-md'
          }
        >
          Get started with Trackit today
        </h1>
        <p
          className={
            'text-lg sm:text-xl md:text-2xl text-muted-foreground text-center mb-12 max-w-screen-sm'
          }
        >
          Trackit provides deep insights of the attendance of online classes
          with great analysis tools.
        </p>
        <ExtensionChooser />
      </div>
    </div>
  )
}

export default Home