import { useState, useEffect } from 'react'
import { moviesApi } from '../api/movies'
import Button from '../components/Button'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import BookingModal from './BookingModal'

export default function HomePage() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMovie, setSelectedMovie] = useState(null)

  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchMovies() {
      try {
        const data = await moviesApi.list()
        setMovies(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchMovies()
  }, [])

  const handleBook = (movie) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setSelectedMovie(movie)
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative overflow-hidden mb-12 bg-slate-900 shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://media.gettyimages.com/id/2212007578/vector/retro-cinema-movie-theatre-entrance-signage-design-lots-of-lights-grain-and-textures.jpg?s=1024x1024&w=gi&k=20&c=VOH-8-Q7hpxaZpF5cKMkgGi8TWz76qebDRhHMZzHjBA=')] bg-cover bg-center opacity-40 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
        <div className="relative z-10 px-8 py-16 sm:px-12 sm:py-24 max-w-2xl">
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-semibold mb-4 border border-indigo-500/30">Baru di Bioskop</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-6">
            Selamat Datang di CinemaX
          </h1>
          <p className="text-lg text-slate-300 mb-8">
            Temukan film terbaik, pesan tempat duduk favoritmu, dan nikmati pengalaman tak terlupakan.
          </p>
          {!isAuthenticated && (
            <Button size="lg" onClick={() => navigate('/login')} className="rounded-full shadow-lg bg-white text-indigo-700 hover:bg-slate-100 font-bold border-none px-8">
              Mulai Sekarang
            </Button>
          )}
        </div>
      </div>

      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Sedang Tayang</h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map(movie => (
            <div key={movie.id} className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 overflow-hidden transition-all hover:-translate-y-1">
              <div className="aspect-[3/4] bg-slate-200 relative overflow-hidden">
                <img
                  src={movie.image ? `http://localhost:3000/uploads/${movie.image}` : `https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=600&auto=format&fit=crop&seed=${movie.id}`}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-slate-800 shadow backdrop-blur-sm">
                    {movie.status}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-slate-900 line-clamp-1 mb-1">{movie.title}</h3>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{movie.description}</p>
                <Button
                  onClick={() => handleBook(movie)}
                  className="w-full rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border-none transition-colors"
                >
                  Pesan Tiket
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedMovie && (
        <BookingModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  )
}
