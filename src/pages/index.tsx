import Head from "next/head";
import { Paintbrush } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";

export default function LandingPage() {
  return (
    <>
      <Head>
        <title>GTPstudio</title>
      </Head>
      <div className="relative isolate px-6 lg:px-8">
        <div className="sm:pt-18 lg:pt-18 mx-auto max-w-2xl pt-20">
          <div className="background-gradient landing-page flex w-full flex-1 flex-col items-center justify-center px-4 text-center">
            <div
              style={{ animation: "fadeInFromTop .8s forwards" }}
              className="mb-5 rounded-lg border border-gray-700 px-4 py-2 text-sm text-foreground transition duration-300 ease-in-out"
            >
              Made by <span className="text-primary-pink">Wes Convery</span>
            </div>
            <h1
              style={{ animation: "fadeInFromTop .8s forwards" }}
              className="font-display mx-auto max-w-4xl text-5xl font-bold tracking-normal text-foreground sm:text-7xl"
            >
              Craft, Print, &amp; Share{" "}
              <span className="relative whitespace-nowrap text-primary-pink">
                <span className="relative"> using AI</span>
              </span>
            </h1>
            <h2
              style={{
                animation:
                  "typing 1.3s steps(40, end), blink-caret .75s step-end infinite",
                borderRight: "3px solid",
                whiteSpace: "nowrap",
                overflow: "hidden",
                width: "100%",
              }}
              className="mx-auto mt-8 max-w-xl text-lg leading-7 text-foreground sm:text-foreground"
            >
              Design, print, and sell your own stunning artwork utilizing
              generative AI
            </h2>
            <SignInButton mode="modal">
              <div
                style={{ animation: "fadeAndSlam 1s forwards" }}
                className="mt-10 flex transform flex-col items-center justify-center rounded-xl border-2 border-primary-pink bg-background/30 p-8 shadow-sm transition-all duration-300 hover:bg-background/70 hover:shadow-lg-pink dark:bg-background/30 hover:dark:bg-background/70"
              >
                <div className="relative flex h-16 w-16 items-center justify-center">
                  <Paintbrush size={64} className="text-primary-pink" />
                </div>
                <div className="mt-4 text-center">
                  <p className="font-medium text-foreground">Start creating</p>
                </div>
              </div>
            </SignInButton>
          </div>
        </div>
      </div>
    </>
  );
}
