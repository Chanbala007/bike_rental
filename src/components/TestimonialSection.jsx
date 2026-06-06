import React from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const reviews = [
  {
    name: 'Akshay Kumar',
    rating: 5,
    timeAgo: '2 weeks ago',
    text: 'Vehicle was in very good condition and all the staff was very humble. Our vehicle got punctured but we got full assistance after contacting their staff. We also got the full refund. Absolutely reliable in Pondicherry.',
    avatar: 'AK',
    avatarColor: 'bg-blue-500',
  },
  {
    name: 'Priya Sharma',
    rating: 5,
    timeAgo: '1 month ago',
    text: 'Best bike rental service in Pondicherry! The bikes were well maintained and the pickup/drop process was super smooth. Will definitely use again on my next visit.',
    avatar: 'PS',
    avatarColor: 'bg-red-500',
  },
  {
    name: 'Rahul Verma',
    rating: 4,
    timeAgo: '3 weeks ago',
    text: 'Great experience renting a scooter for the weekend. Staff was very cooperative and bikes were in excellent condition. Pricing is also very reasonable compared to others.',
    avatar: 'RV',
    avatarColor: 'bg-green-600',
  },
  {
    name: 'Sneha Reddy',
    rating: 5,
    timeAgo: '1 week ago',
    text: 'Amazing service! Booked online and the bike was ready when I arrived. Very clean, well-maintained vehicles. The staff even helped me plan my route around Pondy. Highly recommended!',
    avatar: 'SR',
    avatarColor: 'bg-purple-500',
  },
  {
    name: 'Deepak Nair',
    rating: 5,
    timeAgo: '2 months ago',
    text: 'Used their service for a 3-day trip. The bike was in perfect condition throughout. Customer support was available 24/7 and very responsive. Best rental experience I have had.',
    avatar: 'DN',
    avatarColor: 'bg-orange-500',
  },
]

const GoogleGLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

const StarRating = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
          star <= rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'
        }`}
      />
    ))}
  </div>
)

const ReviewCard = ({ review, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="bg-white rounded-xl p-4 sm:p-5 shadow-[0_1px_6px_rgba(32,33,36,0.12)] border border-gray-100 min-w-[280px] sm:min-w-[320px] max-w-[340px] flex-shrink-0 hover:shadow-[0_2px_12px_rgba(32,33,36,0.18)] transition-shadow duration-200"
  >
    {/* Header: Avatar + Name + Google logo */}
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className={`${review.avatarColor} w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-semibold flex-shrink-0`}>
          {review.avatar}
        </div>
        <div>
          <h4 className="text-sm sm:text-[15px] font-medium text-gray-900 leading-tight">{review.name}</h4>
          <p className="text-xs text-gray-500 mt-0.5">{review.timeAgo}</p>
        </div>
      </div>
      <GoogleGLogo />
    </div>

    {/* Star Rating */}
    <div className="mb-2.5">
      <StarRating rating={review.rating} />
    </div>

    {/* Review Text */}
    <p className="text-[13px] sm:text-sm text-gray-700 leading-relaxed line-clamp-4">
      {review.text}
    </p>
  </motion.div>
)

const TestimonialSection = () => {
  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)

  return (
    <section className="py-14 sm:py-16 md:py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        {/* Section Header — Google Reviews style */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 sm:mb-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                Customer Reviews
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">{avgRating}</span>
                <div className="flex flex-col">
                  <StarRating rating={Math.round(avgRating)} />
                  <span className="text-xs text-gray-500 mt-0.5">{reviews.length} reviews</span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Reviews Carousel - Auto Sliding */}
        <div className="relative max-w-full overflow-hidden mt-2 flex">
          <div className="flex animate-[scrollReviews_35s_linear_infinite] hover:[animation-play-state:paused] w-max">
            {/* We render 3 identical blocks to ensure seamless scrolling */}
            {[1, 2, 3].map((blockIdx) => (
              <div key={blockIdx} className="flex gap-4 sm:gap-6 px-2 sm:px-3">
                {reviews.map((review, index) => (
                  <div key={index}>
                    <ReviewCard review={review} index={index} />
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Fade edges */}
          <div className="absolute inset-y-0 left-0 w-12 sm:w-24 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none z-10" />
          <div className="absolute inset-y-0 right-0 w-12 sm:w-24 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none z-10" />
        </div>

        {/* CSS for scroll animation */}
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes scrollReviews {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.333333%); }
          }
        `}} />

        {/* Google branding footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-2 mt-6 sm:mt-8"
        >
          <GoogleGLogo />
          <span className="text-xs sm:text-sm text-gray-500 font-medium">Reviews from Google</span>
        </motion.div>
      </div>
    </section>
  )
}

export default TestimonialSection
