'use client';

export default function CallToActionSection() {

    return (
        <div className="py-12 bg-stone-100 dark:bg-stone-900">
            <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
                <div className="my-12 text-center">
                    <h2 className="text-3xl font-semibold leading-tight text-gray-800 dark:text-gray-100">
                        Join the Carbon Revolution
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                        Start Your Journey Towards Sustainable Land Management
                    </p>
                    <p className="mt-2 max-w-3xl mx-auto text-gray-500 dark:text-gray-300">
                        Our platform simplifies the carbon offset process by helping you
                        assess land feasibility, analyze potential, and calculate verified carbon credits.
                    </p>
                </div>
                <div className="flex justify-center">
                    <button
                        type="button"
                        className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    >
                        Get Started
                    </button>
                </div>
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Already have an account?{' '}
                        <a href="/login" className="text-green-600 hover:text-green-500">
                            Log in
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}