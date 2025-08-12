import { PiWaveformBold } from "react-icons/pi";
import { IoHeadset } from "react-icons/io5";
import { NavLink } from "react-router";

export default function Logo({ size, color="text-accent" }) {
  return (
    <div>
      <NavLink
        to={"/"}
        className={"flex flex-wrap justify-center items-center gap-3"}
      >
        <IoHeadset className={`${color}`} size={size} />
        {/* <span className="font-primary text-sm">Alabah <span className="text-accent">Beatstore</span></span> */}
      </NavLink>
    </div>
  );
}
