export default function Home() {
  return (
    <div className="flex justify-evenly items-center mt-10 p-20">
      <div className="card card-compact bg-base-100 w-96 shadow-xl">
        <figure>
          <img className="w-[200px] h-[200px]"
            src="/face1.png"
            alt="Detection Face" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Face</h2>
          <p>Detection face</p>
          <a rel="noopener noreferrer" href="https://www.freepik.com/search" 
          className="text-blue-700 underline underline-offset-2 decoration-blue-700">Icon by Freepik</a>
          <div className="card-actions justify-end">
            <a href="/face" className="btn btn-sm btn-neutral">Get start</a>
          </div>
        </div>
      </div>

      <div className="card card-compact bg-base-100 w-96 shadow-xl">
        <figure>
          <img className="w-[200px] h-[200px]"
            src="/glasseshome.png"
            alt="Detection Glasses" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Glasses</h2>
          <p>Detection glasses </p>
          <a rel="noopener noreferrer" href="https://www.freepik.com/search" 
          className="text-blue-700 underline underline-offset-2 decoration-blue-700">Icon by Freepik</a>
          <div className="card-actions justify-end">
          <a href="/glasses" className="btn btn-sm btn-neutral">Get start</a>
          </div>
        </div>
      </div>

      <div className="card card-compact bg-base-100 w-96 shadow-xl">
        <figure>
          <img className="w-[200px] h-[200px]"
            src="/cap.png"
            alt="Detection Cap" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Hat</h2>
          <p>Detection hat</p>
          <a rel="noopener noreferrer" href="https://www.freepik.com/search" 
          className="text-blue-700 underline underline-offset-2 decoration-blue-700">Icon by Freepik</a>
          <div className="card-actions justify-end">
          <a href="/hat" className="btn btn-sm btn-neutral">Get start</a>
          </div>
        </div>
      </div>
    </div>
  );
}
