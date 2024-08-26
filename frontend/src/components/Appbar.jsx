function Appbar() {
    return (
      <>
        <div className="shadow h-36 flex justify-evenly text-[1.2rem]">
          <div className="flex flex-col mt-5 h-full ml-0">
            <svg
              width="80"
              height="150"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 80 150"
            >
              <rect width="80" height="100" rx="10" ry="10" fill="#9DC1F2" />
  
              <rect
                x="20"
                y="10"
                width="40"
                height="40"
                rx="5"
                ry="5"
                fill="#ffffff"
              />
              <rect x="25" y="18" width="30" height="3" fill="#9DC1F2" />
              <rect x="25" y="25" width="30" height="3" fill="#9DC1F2" />
              <rect x="25" y="32" width="30" height="3" fill="#9DC1F2" />
              <rect x="25" y="39" width="30" height="3" fill="#9DC1F2" />
  
              <text
                x="14"
                y="70"
                font-family="Arial, sans-serif"
                font-size="18"
                fill="#ffffff"
                font-weight="bold"
              >
                Smart
              </text>
              <text
                x="10"
                y="90"
                font-family="Arial, sans-serif"
                font-size="18"
                fill="#ffffff"
                font-weight="bold"
              >
                Sheets
              </text>
            </svg>
          </div>
  
          <div className="flex">
            <div className="flex flex-col h-full mr-8 mt-6">File</div>
            <div className="flex flex-col h-full mr-8 mt-6">Edit</div>
            <div className="flex flex-col h-full mr-8 mt-6">View</div>
            <div className="flex flex-col h-full mr-8 mt-6">Insert</div>
            <div className="flex flex-col h-full mr-8 mt-6">Data</div>
          </div>
  
          <div>
            <input
              className="rounded-full h-10 w-[35rem] bg-[#EAF1FF] mt-5 placeholder-center"
              placeholder="   Search"
            />
          </div>
          <div className="flex">
            <div className="flex flex-col h-full mr-6 mt-6">Collaborate</div>
            <div className="flex flex-col h-full mr-6 mt-6">Comments</div>
            <div className="flex flex-col h-full mr-12 mt-6">Share</div>
            <div className="rounded-full h-16 w-16 bg-[#EAF1FF] flex justify-center mt-10 mr-0">
              <div className="flex flex-col justify-center h-full text-xl">
                👤
              </div>
            </div>
          </div>
        </div>
  
        <div>
          {/* create formula bar */}
          <div className="bg-[#EAF1FF] h-10 w-screen flex justify-center items-center text-[1.2rem] rounded">
            <div className="flex justify-center items-center h-full w-20 bg-white rounded-l-full m">
                  fx
              <input className="h-full w-96 bg-[#EAF1FF] placeholder-center" placeholder="   Enter formula here"/>
              </div>
              </div>
        </div>
  
      </>
    );
  }
  
  export default Appbar;
  
  