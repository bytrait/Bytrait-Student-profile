export default function Navbar() {
    return (
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-xl font-bold">Careerlogy</h1>
          <div className="space-x-4">
            <a href="/login" className="text-white hover:text-gray-300">
              Login
            </a>
            <a href="/signup" className="text-white hover:text-gray-300">
              Signup
            </a>
          </div>
        </div>
      </nav>
    );
  }