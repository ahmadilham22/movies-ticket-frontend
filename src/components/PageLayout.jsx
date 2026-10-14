import PageContainer from "./PageContainer";

const PageLayout = ({ children }) => {
  return (
    <main className="min-h-screen bg-zinc-950 text-white scheme-dark">
      <PageContainer>{children}</PageContainer>
    </main>
  );
};

export default PageLayout;
