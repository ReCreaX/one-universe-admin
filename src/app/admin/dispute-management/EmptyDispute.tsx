import Image from "next/image";

const EmptyDispute = () => {
  return (
    <section className="py-12 flex items-center justify-center">
      <section className="flex items-center justify-center flex-col">
        <Image
          src="/empty/empty-state.png"
          alt="Empty State"
          width={150}
          height={150}
        />
        <aside className="flex items-center justify-center flex-col gap-3 text-[1rem] leading-[140%] mt-4">
          <h3 className="text-center text-[#171417] font-bold">
            No Disputes Found
          </h3>
          <p className="text-center text-[#6B6969] font-normal">
            There are currently no disputes to review.
          </p>
        </aside>
      </section>
    </section>
  );
};

export default EmptyDispute;
