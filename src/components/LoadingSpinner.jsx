import { CgSpinnerTwoAlt } from "react-icons/cg";

export default function LoadingSpinner({ size, color }) {
  return <CgSpinnerTwoAlt className="animate-spin" size={size} color={color} />;
}
