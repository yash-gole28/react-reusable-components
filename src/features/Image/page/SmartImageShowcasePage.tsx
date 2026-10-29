import { SmartImage } from "./../component/SmartImage";

// ─────────────────────────────────────────────────────────────
// Dummy Data
// ─────────────────────────────────────────────────────────────

const products = [
  {
    id: 1,
    title: "Nike Air Max",
    price: "$129",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Minimal Chair",
    price: "$89",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Smart Watch",
    price: "$249",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "DSLR Camera",
    price: "$799",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "MacBook Setup",
    price: "$1999",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "Gaming Headphones",
    price: "$149",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 7,
    title: "Coffee Mug",
    price: "$19",
    image:
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 8,
    title: "Mountain Bike",
    price: "$999",
    image:
      "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?q=80&w=1200&auto=format&fit=crop",
  },
];

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export default function SmartImageShowcasePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">
          Reusable Component
        </p>

        <h1 className="text-4xl font-bold tracking-tight">
          Smart Image Showcase
        </h1>

        <p className="text-slate-400 mt-3 max-w-2xl">
          Production-grade reusable image component with lazy loading,
          caching, fallback handling, skeleton loaders, retry logic,
          aspect ratio preservation, and infinite-scroll optimization.
        </p>
      </div>

      {/* Product Grid */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-semibold">
            Ecommerce Product Grid
          </h2>

          <span className="text-sm text-slate-500">
            {products.length} Products
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="
                group
                rounded-3xl
                overflow-hidden
                bg-slate-900
                border
                border-slate-800
                hover:border-slate-700
                transition-all
                duration-300
              "
            >
              {/* Smart Image */}
              <SmartImage
                src={product.image}
                alt={product.title}
                aspectRatio="1 / 1"
                fallbackSrc="https://placehold.co/600x600?text=No+Image"
                className="
                  group-hover:scale-105
                  transition-transform
                  duration-500
                "
              />

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-lg text-white">
                      {product.title}
                    </h3>

                    <p className="text-slate-400 text-sm mt-1">
                      Premium Quality Product
                    </p>
                  </div>

                  <span className="text-emerald-400 font-medium">
                    {product.price}
                  </span>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-5">
                  <button
                    className="
                      flex-1
                      h-10
                      rounded-xl
                      bg-white
                      text-slate-900
                      text-sm
                      font-medium
                      hover:opacity-90
                      transition-opacity
                    "
                  >
                    Buy Now
                  </button>

                  <button
                    className="
                      h-10
                      px-4
                      rounded-xl
                      border
                      border-slate-700
                      text-sm
                      hover:bg-slate-800
                      transition-colors
                    "
                  >
                    ♡
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Avatar Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-5">
          Avatar Examples
        </h2>

        <div className="flex flex-wrap gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-3"
            >
              <SmartImage
                src={`https://i.pravatar.cc/300?img=${i + 1}`}
                aspectRatio="1 / 1"
                containerClassName="w-20 rounded-full"
                className="rounded-full"
                fallbackSrc="https://placehold.co/200x200?text=User"
              />

              <div className="text-center">
                <p className="text-sm font-medium">
                  User {i + 1}
                </p>

                <p className="text-xs text-slate-500">
                  Frontend Dev
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Masonry Gallery */}
      <section>
        <h2 className="text-2xl font-semibold mb-5">
          Masonry Gallery
        </h2>

        <div className="columns-2 md:columns-4 gap-4 space-y-4">
          {products.map((item) => (
            <div
              key={item.id}
              className="break-inside-avoid overflow-hidden rounded-2xl"
            >
              <SmartImage
                src={item.image}
                aspectRatio={Math.random() > 0.5 ? "1 / 1.3" : "1 / 1"}
                className="
                  hover:scale-[1.03]
                  transition-transform
                  duration-500
                "
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}