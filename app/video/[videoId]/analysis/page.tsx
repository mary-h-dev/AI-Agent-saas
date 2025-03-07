function AnalysisPage() {
    return (
      <div className="xl:container mx-auto px-4 md:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Left Side */}
          <div className="order-2 lg:order-1 flex flex-col gap-4 bg-white lg:border-r border-gray-200 p-6">
            <h2 className="text-xl font-semibold">Analysis Section</h2>
            
            {/* YouTube video details */}
            {/* Thumbnail Generation */}
            {/* Title Generation */}
            {/* Transcription */}
            <p>Cool stuff</p>
          </div>
  
          {/* Right Side */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-20 h-[500px] md:h-[calc(100vh-6rem)]">
            <h2 className="text-xl font-semibold">AI Agent Chat Section</h2>
            <p>Chat</p>
          </div>
  
        </div>
      </div>
    );
  }
  
  export default AnalysisPage;
  
