const ReportSummaryNote = () => {
  return (
    <>
      <button
        type="button"
        className="text-purple-dark mt-6"
      >{`[Download Full Report PDF]`}</button>
      <p className="py-4 text-[20px]">Next Steps</p>
      <ul className="text-[14px] space-y-2 ml-5">
        <li className="list-disc">
          <span className="font-bold">Explore Partnership Opportunities:</span>{" "}
          Select a suggested brand to generate a tailored pitch deck.
        </li>
        <li className="list-disc">
          <span className="font-bold">Refine Content Ideas:</span> Get
          recommendations for TikTok content tailored to this segment..
        </li>
        <li className="list-disc">
          <span className="font-bold">Monitor & Update:</span> Enable continuous
          tracking for this segment to uncover new trends and engagement
          opportunities. Ongoing Tracking Enabled ✅
        </li>
      </ul>
    </>
  );
};

export default ReportSummaryNote;
