import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Zap, Leaf, Home, ShieldAlert, Sparkles, Fuel, Trees } from "lucide-react";
import { SpotlightCard } from "./ui/SpotlightCard";

export const ImpactVisualizer = () => {
  const [mode, setMode] = useState<"solar" | "ev">("solar");
  
  // Solar state parameters
  const [solarCapacity, setSolarCapacity] = useState(75); // kWp
  
  // EV state parameters
  const [fleetSize, setFleetSize] = useState(50); // Vehicles
  const [dailyMileage, setDailyMileage] = useState(90); // km/day

  // Refs for tracking in view animation
  const visualRef = useRef(null);

  // Solar calculations
  const annualYieldFactor = 1480; // kWh per kWp annually in Nairobi
  const solarEnergyGenerated = Math.round(solarCapacity * annualYieldFactor);
  const solarCo2Offset = (solarCapacity * annualYieldFactor * 0.00045).toFixed(1); // tons CO2 avoided
  const homesPowered = Math.round((solarCapacity * annualYieldFactor) / 1800); // homes powered (1800kWh/year)
  const solarTreesEquivalent = Math.round(parseFloat(solarCo2Offset) * 16.5); // equivalent trees

  // EV calculations
  const evKmsDriven = fleetSize * dailyMileage * 365;
  const evCo2Offset = (evKmsDriven * 0.000115).toFixed(1); // 115g CO2 saved per km relative to ICE
  const fuelSaved = Math.round(evKmsDriven * 0.075); // 7.5L/100km fuel saved
  const evTreesEquivalent = Math.round(parseFloat(evCo2Offset) * 16.5);

  return (
    <section ref={visualRef} className="py-16 sm:py-24 px-6 relative overflow-hidden bg-background">
      {/* Background radial masking grid */}
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-primary font-medium mb-3 block flex items-center justify-center gap-1.5 text-sm tracking-widest uppercase">
            <Sparkles className="w-4 h-4 animate-pulse" /> Interactive Simulation
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Clean Energy <span className="gradient-text">Impact Estimator</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            Drag the parameters to simulate real-world environmental and utility impact based on my clean energy and e-mobility projects.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-muted/40 p-1.5 rounded-2xl border border-border/50 backdrop-blur-md">
            <button
              onClick={() => setMode("solar")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                mode === "solar"
                  ? "bg-primary text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sun className={`w-4 h-4 ${mode === "solar" ? "animate-spin" : ""}`} style={{ animationDuration: "12s" }} />
              Solar PV Grid
            </button>
            <button
              onClick={() => setMode("ev")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                mode === "ev"
                  ? "bg-primary text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Zap className="w-4 h-4" />
              E-Mobility Fleet
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-5 gap-8 items-stretch">
          {/* Controls - Left Cards */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <SpotlightCard
              className="glass-card rounded-3xl p-6 border border-white/10 dark:border-white/5 h-full flex flex-col justify-center"
              glowColor={mode === "solar" ? "rgba(20, 184, 166, 0.1)" : "rgba(16, 185, 129, 0.1)"}
            >
              <h3 className="text-xl font-display font-bold mb-6 text-foreground flex items-center gap-2">
                {mode === "solar" ? (
                  <>
                    <Sun className="w-5 h-5 text-primary" /> Solar Parameters
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 text-primary" /> Fleet Parameters
                  </>
                )}
              </h3>

              <AnimatePresence mode="wait">
                {mode === "solar" ? (
                  <motion.div
                    key="solar-controls"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <div className="flex justify-between items-baseline mb-2">
                        <label className="text-sm font-medium text-muted-foreground">Array Capacity</label>
                        <span className="text-xl font-display font-bold text-primary">{solarCapacity} kWp</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="500"
                        step="5"
                        value={solarCapacity}
                        onChange={(e) => setSolarCapacity(parseInt(e.target.value))}
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                        <span>5 kWp (Residential)</span>
                        <span>500 kWp (Industrial)</span>
                      </div>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 text-xs leading-relaxed text-muted-foreground/90">
                      <strong>Nairobi Solar Yield:</strong> East Africa yields approximately 1,480 kWh of electricity annually per 1 kWp of installed high-efficiency solar capacity.
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="ev-controls"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <div className="flex justify-between items-baseline mb-2">
                        <label className="text-sm font-medium text-muted-foreground">Fleet Operations</label>
                        <span className="text-xl font-display font-bold text-primary">{fleetSize} EVs</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="250"
                        step="5"
                        value={fleetSize}
                        onChange={(e) => setFleetSize(parseInt(e.target.value))}
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                        <span>5 Motorbikes</span>
                        <span>250 Buses/Bikes</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-baseline mb-2">
                        <label className="text-sm font-medium text-muted-foreground">Daily Operational Range</label>
                        <span className="text-xl font-display font-bold text-primary">{dailyMileage} km</span>
                      </div>
                      <input
                        type="range"
                        min="30"
                        max="180"
                        step="5"
                        value={dailyMileage}
                        onChange={(e) => setDailyMileage(parseInt(e.target.value))}
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                        <span>30 km (Urban commute)</span>
                        <span>180 km (Heavy logistics)</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </SpotlightCard>
          </div>

          {/* Impact Stats Display - Right Cards */}
          <div className="lg:col-span-3 grid sm:grid-cols-2 gap-4">
            {/* Metric Card 1: CO2 Avoided */}
            <SpotlightCard className="glass-card rounded-3xl p-6 border border-white/10 dark:border-white/5 flex flex-col justify-between group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Leaf className="w-5 h-5 text-emerald-400" />
                </div>
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">CO₂ Offset Annually</h4>
              </div>
              <div className="mt-4">
                <div className="text-4xl sm:text-5xl font-display font-bold gradient-text tracking-tight mb-1">
                  {mode === "solar" ? solarCo2Offset : evCo2Offset}
                </div>
                <div className="text-xs text-muted-foreground font-medium">Metric Tons of carbon avoided</div>
              </div>
            </SpotlightCard>

            {/* Metric Card 2: Tree equivalent */}
            <SpotlightCard className="glass-card rounded-3xl p-6 border border-white/10 dark:border-white/5 flex flex-col justify-between group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Trees className="w-5 h-5 text-teal-400" />
                </div>
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Forestry Equivalent</h4>
              </div>
              <div className="mt-4">
                <div className="text-4xl sm:text-5xl font-display font-bold gradient-text tracking-tight mb-1">
                  {mode === "solar" ? solarTreesEquivalent : evTreesEquivalent}
                </div>
                <div className="text-xs text-muted-foreground font-medium">Tree seedlings grown for 10 years</div>
              </div>
            </SpotlightCard>

            {/* Metric Card 3: Energy Generated or Petrol Saved */}
            <SpotlightCard className="glass-card rounded-3xl p-6 border border-white/10 dark:border-white/5 flex flex-col justify-between group">
              {mode === "solar" ? (
                <>
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                      <Sun className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Energy Generated</h4>
                  </div>
                  <div className="mt-4">
                    <div className="text-3xl sm:text-4xl font-display font-bold gradient-text tracking-tight mb-1">
                      {solarEnergyGenerated.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">Kilowatt-hours (kWh) of clean energy</div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                      <Fuel className="w-5 h-5 text-amber-400" />
                    </div>
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Imported Fuel Displaced</h4>
                  </div>
                  <div className="mt-4">
                    <div className="text-3xl sm:text-4xl font-display font-bold gradient-text tracking-tight mb-1">
                      {fuelSaved.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">Liters of gasoline saved annually</div>
                  </div>
                </>
              )}
            </SpotlightCard>

            {/* Metric Card 4: Homes Powered or Range index */}
            <SpotlightCard className="glass-card rounded-3xl p-6 border border-white/10 dark:border-white/5 flex flex-col justify-between group">
              {mode === "solar" ? (
                <>
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                      <Home className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Microgrid Capacity</h4>
                  </div>
                  <div className="mt-4">
                    <div className="text-3xl sm:text-4xl font-display font-bold gradient-text tracking-tight mb-1">
                      {homesPowered}
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">East African homes fully powered</div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                      <Zap className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Operations Run</h4>
                  </div>
                  <div className="mt-4">
                    <div className="text-3xl sm:text-4xl font-display font-bold gradient-text tracking-tight mb-1">
                      {evKmsDriven.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">Combined clean kilometers driven</div>
                  </div>
                </>
              )}
            </SpotlightCard>
          </div>
        </div>
      </div>
    </section>
  );
};
