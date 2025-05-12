import joinClassName from "@/util/joinClassName";
import "./Divider.css";

export const Divider = ({
  className,
  ...props
}: {
  className?: string;
} & React.ComponentProps<"hr">) => {
  return <div className={joinClassName("C_Divider", className)} {...props} />;
};

export default Divider;
