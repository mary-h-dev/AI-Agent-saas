"use client";
import AgentPulse from "@/components/AgentPulse";
import { SparklesCore } from "@/components/ui/sparkles";
import YoutubeVideoForm from "@/components/YoutubeVideoForm";
import { features, steps } from "@/constant";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className=" bg-black pt-20 pb-2">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-10 text-center mb-12">
            {/* <AgentPulse size="large" color="blue" /> */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-600 mb-6">
              Meet Your Personal{" "}
              <span className="bg-gradient-to-r from-blue-700 to-blue-400 bg-clip-text text-transparent">
                AI Content Agent
              </span>
            </h1>
            <p className="text-xl text-blue-600 mb-8 max-w-2xl mx-auto">
              Transform your video content with AI-powered analysis,
              transcription, and insights. Get started in seconds.
            </p>
            <div className="h-[25rem] w-full flex flex-col items-center justify-center overflow-hidden rounded-md">
              <div className="relative z-20 w-full h-full">
                <YoutubeVideoForm />
              </div>

              <div className="w-[40rem] relative">
                {/* Gradients */}
                <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
                <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
                <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
                <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

                {/* Core component */}
                <SparklesCore
                  background="transparent"
                  minSize={0.4}
                  maxSize={1}
                  particleDensity={1200}
                  className="w-full h-full"
                  particleColor="#FFFFFF"
                />

                {/* Radial Gradient to prevent sharp edges */}
                <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className=" bg-black pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl md:text-5xl text-blue-600 font-bold text-center mb-16">
            Powerful Features for Content Creators
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-black p-6 rounded-xl border border-gray-200 hover:border-blue-500 transition-all duration-300"
                >
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feature.iconBg}`}
                  >
                    <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                  </div>
                  <h3 className=" text-gray-400 text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-white font-light text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl md:text-5xl text-blue-600 font-bold text-center mb-12">
            Meet Your AI Agent in 3 Simple Steps
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="text-center p-6 rounded-xl bg-black border border-gray-700 shadow-md hover:shadow-lg transition-all"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-gray-400 text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-white font-light text-sm">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <section className="py-20 px-4 md:px-0 border-t border-gray-700 bg-black">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Meet Your AI Content Agent?
          </h2>
          <p className="text-xl text-blue-50">
            Join creators leveraging AI to unlock content insights
          </p>
        </div>
      </section>
    </div>
  );
}
