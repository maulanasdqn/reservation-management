import { FC, ReactElement } from "react";
import { FaCheck } from "react-icons/fa";
export const ScanSuccessModule: FC = (): ReactElement => {
  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-start lg:justify-center mt-12 py-8 lg:mt-0 ">
      <div className="flex w-4/6 h-4/6 lg:w-1/4 relative lg:h-1/4 aspect-square lg:aspect-auto z-10 items-center justify-center p-6 bg-green-200 text-white rounded-full">
        <div className="w-4/6 h-4/6 aspect-square bg-green-500 p-4 rounded-full absolute z-20 animate-ping"></div>
        <div className="flex w-full h-full aspect-square bg-green-500 p-4 rounded-full justify-center items-center z-30">
          <FaCheck size={40} className="h-1/2 w-4/6" />
        </div>
      </div>
      <h1 className="font-bold text-4xl lg:text-5xl text-gray-700 mt-12">Check in Berhasil</h1>
    </section>
  );
};
