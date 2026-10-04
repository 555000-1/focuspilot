import { useState } from "react";
import Landing from "@/sections/Landing";
import Planner from "@/sections/Planner";

export default function Home() {
  const [view, setView] = useState<"landing" | "app">("landing");
  const [wantPro, setWantPro] = useState(false);

  if (view === "app") {
    return (
      <Planner
        onHome={() => {
          setView("landing");
          setWantPro(false);
        }}
        openPaywallOnMount={wantPro}
      />
    );
  }
  return (
    <Landing
      onLaunch={() => setView("app")}
      onPro={() => {
        setWantPro(true);
        setView("app");
      }}
    />
  );
}
