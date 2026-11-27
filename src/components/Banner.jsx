import avengers from "../assets/Avengers.png";
import avengersLogo from "../assets/Avengers_logo.png";

function Banner() {
  return (
    <div className="pl-[45px] pr-[25px] flex justify-between mt-[50px] h-[100px] w-full bg-dark">
      <div className="flex gap-[83px]">
        <img src={avengers} alt="Illustration of the Avengers team" />
        <p className="self-center text-white text-[24px] font-[700]">
          New comics every week! <br /> Stay tuned!
        </p>
      </div>
      <img src={avengersLogo} alt="Avengers logo" />
    </div>
  );
}

export default Banner;
