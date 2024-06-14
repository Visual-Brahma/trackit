import Script from "next/script";

const FeedbackPage = () => {
  return (
    <>
      <iframe
        className="absolute top-0 right-0 bottom-0 left-0 bg-background"
        data-tally-src="https://tally.so/r/w72DxP?transparentBackground=1"
        width="100%"
        height="100%"
        title="Trackit Feedback"
      ></iframe>
      <Script async src="https://tally.so/widgets/embed.js" />
    </>
  );
};

export default FeedbackPage;
