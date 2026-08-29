import { PropsWithChildren, useEffect, useState } from "react";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import TechStackNew from "./TechStackNew";
import CallToAction from "./CallToAction";
import setSplitText from "./utils/splitText";
import { initialFX } from "./utils/initialFX";
import { setAllTimeline } from "./utils/GsapScroll";
import Premium3DObject from "./Premium3DObject";

const MainContainer = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      initialFX();
      setAllTimeline();
    }, 500); // Give the DOM a tiny bit to render before animating
    const resizeHandler = () => {
      setSplitText();
      setAllTimeline();
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="container-main">
      <Premium3DObject />
      <Cursor />
      <Navbar />
      <SocialIcons />
      <div className="container-main">
        <Landing />
        <About />
        <WhatIDo />
        <Career />
        <Work />
        <TechStackNew />
        <CallToAction />
        <Contact />
      </div>
    </div>
  );
};

export default MainContainer;
