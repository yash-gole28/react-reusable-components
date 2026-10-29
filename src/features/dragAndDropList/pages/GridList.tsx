import { InfiniteScroll } from "../../InfiniteScrollwithVirtualization/components/InfiniteScrollVirtualizationReusableContainer";
import { usePaginatedInfiniteQuery } from "../../../components/usePaginatedInfiniteQuery ";
import { ScrollMotion } from "../../scrollMotion/components/ScrollMotion";

const GridList = () => {
    const fetchProducts = async ({
        skip,
        take,
    }: {
        skip: number;
        take: number;
    }) => {
        const res = await fetch(
            `https://dummyjson.com/products?limit=${take}&skip=${skip}`
        );

        if (!res.ok) {
            throw new Error("Failed to fetch products");
        }

        const json = await res.json();

        // await new Promise((resolve) => setTimeout(resolve, 2000));

        return {
            data: json.products.map((item: any) => ({
                id: item.id,
                title: item.title,
                description: item.description,
                category: item.category,
                price: item.price,
                image: item.thumbnail, // 👈 important mapping
            })),
            total: json.total,
        };
    };

    const query = usePaginatedInfiniteQuery({
        queryKey: ["products"],
        fetchFn: fetchProducts,
        take: 12,
    });

    return (
         <InfiniteScroll
      query={query}
      estimateHeight={80}
      gap={5}
      breakpoints={{
        xs: 1,
        sm: 1,
        md: 1,
        lg: 1,
      }}
      renderCard={(item: any, index?: number) => (
        <ScrollMotion
          effect="fade-up"
          duration={700}
          distance={40}
          delay={(index ?? 0) * 40}
          once
        >
         <div className="bg-slate-200 p-2 rounded">
                    <div>
                        {item.title}
                    </div>
                    <div className="truncate">
                        {item.description}
                    </div>
                </div>
        </ScrollMotion>
      )}
    />
    );
};

export default GridList;