"use client"

import { useState } from "react"
import { ProjectBasics } from "@/components/calculator/project-build/ProjectBasics"
import { PlatformSelector } from "@/components/calculator/project-build/PlatformSelector"
import { FeaturesSection } from "@/components/calculator/project-build/FeaturesSection"
import { LiveEstimatePanel } from "@/components/calculator/shared/LiveEstimatePanel"
import { TeamArchitect } from "@/components/calculator/team-scaling/TeamArchitect"
import { ROIDashboard } from "@/components/calculator/team-scaling/ROIDashboard"

export default function CalculatorPage() {
  const [activeTab, setActiveTab] = useState<'build' | 'scale'>('build')

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/30 selection:text-foreground">
      {/* Navbar / Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-accent">BARAKODE</span>
            <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block border-l border-border pl-2 border-accent/20">Cost Engine</span>
          </div>
        </div>
      </header>

      <main className="container py-8 md:py-12">
        <div className="flex flex-col items-center text-center space-y-6 mb-12">
          <div className="space-y-4 max-w-3xl">
            {activeTab === 'build' ? (
              <>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">Project Cost Estimator</h1>
                <p className="text-muted-foreground text-lg md:text-xl text-balance">
                  Estimate your project build and scaling costs instantly. Adjust variables, choose platforms, and see how much Barakode AI orchestration saves you.
                </p>
              </>
            ) : (
              <>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">Team Scaling Simulator</h1>
                <p className="text-muted-foreground text-lg md:text-xl text-balance">
                  Forecast burn rate, assess equity dilution, and optimize your engineering team for maximum velocity.
                </p>
              </>
            )}
          </div>

          <div className="flex p-1 bg-muted rounded-xl border border-border/50 shadow-sm">
            <button
              onClick={() => setActiveTab('build')}
              className={`px-6 py-2.5 text-sm font-bold transition-all rounded-lg ${
                activeTab === 'build' 
                  ? 'bg-accent text-accent-foreground shadow-md' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              }`}
            >
              Project Build
            </button>
            <button
              onClick={() => setActiveTab('scale')}
              className={`px-6 py-2.5 text-sm font-bold transition-all rounded-lg ${
                activeTab === 'scale' 
                  ? 'bg-accent text-accent-foreground shadow-md' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              }`}
            >
              Team Scaling
            </button>
          </div>
        </div>

        {activeTab === 'build' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Main Content Area */}
            <div className="lg:col-span-8 space-y-8">
              <ProjectBasics />
              <PlatformSelector />
              <FeaturesSection />
            </div>

            {/* Sticky Sidebar Area */}
            <div className="lg:col-span-4 relative">
              <div className="sticky top-24 z-10">
                <LiveEstimatePanel />
              </div>
            </div>

          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 w-full items-start">
            <div className="w-full lg:w-[22%] shrink-0">
              <TeamArchitect />
            </div>
            <div className="w-full lg:w-[78%]">
              <ROIDashboard />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}