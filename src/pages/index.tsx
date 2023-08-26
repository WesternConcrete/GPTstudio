import Head from "next/head"
import { Paintbrush } from 'lucide-react';
import { SignInButton } from "@clerk/nextjs";

export default function Home() {

  return (
    <>
      <Head>
        <title>GTPstudio</title>
      </Head>
      <div className="relative isolate px-6 lg:px-8">

        <div className="mx-auto max-w-2xl pt-20 sm:pt-18 lg:pt-18">
        <div className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 background-gradient landing-page">
      <div
          style={{ animation: 'fadeInFromTop .8s forwards' }}
          className="border border-gray-700 rounded-lg py-2 px-4 text-foreground text-sm mb-5 transition duration-300 ease-in-out"
        >
          Made by {" "}
          <span className="text-primary-pink">Wes Convery</span>
        </div>
        <h1 style={{ animation: 'fadeInFromTop .8s forwards' }} className="mx-auto max-w-4xl font-display text-5xl font-bold tracking-normal text-foreground sm:text-7xl">
  Craft, Print, &amp; Sell {" "}
  <span className="relative whitespace-nowrap text-primary-pink">
    <span className="relative"> using AI</span>
  </span>
</h1>
<h2 style={{ 
    animation: 'typing 1.3s steps(40, end), blink-caret .75s step-end infinite',
    borderRight: '3px solid',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    width: '100%'
  }}
  className="mx-auto mt-8 max-w-xl text-lg sm:text-foreground text-foreground leading-7">
Design, print, and sell your own stunning artwork utilizing generative AI
</h2>
<SignInButton mode="modal"><button style={{ animation: 'fadeAndSlam 1s forwards' }} className="flex flex-col items-center justify-center p-8 bg-background/30 dark:bg-background/30 border-2 border-primary-pink rounded-xl shadow-sm hover:shadow-lg-pink hover:bg-background/70 hover:dark:bg-background/70 transform transition-all duration-300 mt-10">
  <div className="w-16 h-16 flex items-center justify-center relative">
    <Paintbrush size={64} className="text-primary-pink" />
  </div>
  <div className="mt-4 text-center">
    <p className="text-foreground font-medium">Start creating</p>
  </div>
</button></SignInButton>


      </div>
        </div>
    
      </div>
 
     
    </>
  )
}
