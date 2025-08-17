"use client"

import { useEffect, useState } from "react"
// import Image from "next/image"
import { MapPin, Clock, Search, Filter } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/button/Input"
// import Badge from "@/components/ui/button/Badge"
// import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/badge/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Button from "@/components/ui/button/Button"
// import Badge from "@/components/ui/badge/Badge"
// import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card/Card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select/Select"
import { Card, CardContent, CardFooter } from "@/components/ui/card/Card"
import { Input } from "@/components/ui/input/Input"
import { getListTours } from "@/services/tour.service"
import Link from "next/link"

// Mock data for tours
// const tours = [
//   {
//     id: 1,
//     title: "Hạ Long Bay Cruise Adventure",
//     description: "Khám phá vẻ đẹp kỳ vĩ của Vịnh Hạ Long với tour du thuyền 2 ngày 1 đêm",
//     image: "/placeholder.svg?height=300&width=400",
//     price: 2500000,
//     originalPrice: 3000000,
//     rating: 4.8,
//     reviews: 124,
//     duration: "2 ngày 1 đêm",
//     location: "Quảng Ninh",
//     maxGuests: 20,
//     category: "Biển đảo",
//     featured: true,
//   },
//   {
//     id: 2,
//     title: "Sapa Trekking Experience",
//     description: "Chinh phục đỉnh Fansipan và khám phá văn hóa dân tộc thiểu số",
//     image: "/placeholder.svg?height=300&width=400",
//     price: 1800000,
//     originalPrice: 2200000,
//     rating: 4.6,
//     reviews: 89,
//     duration: "3 ngày 2 đêm",
//     location: "Lào Cai",
//     maxGuests: 15,
//     category: "Núi rừng",
//   },
//   {
//     id: 3,
//     title: "Hội An Ancient Town Tour",
//     description: "Khám phá phố cổ Hội An và làng nghề truyền thống",
//     image: "/placeholder.svg?height=300&width=400",
//     price: 1200000,
//     originalPrice: 1500000,
//     rating: 4.7,
//     reviews: 156,
//     duration: "1 ngày",
//     location: "Quảng Nam",
//     maxGuests: 25,
//     category: "Văn hóa",
//   },
//   {
//     id: 4,
//     title: "Mekong Delta Discovery",
//     description: "Trải nghiệm cuộc sống miền Tây sông nước và thưởng thức đặc sản",
//     image: "/placeholder.svg?height=300&width=400",
//     price: 980000,
//     originalPrice: 1200000,
//     rating: 4.5,
//     reviews: 78,
//     duration: "1 ngày",
//     location: "Cần Thơ",
//     maxGuests: 30,
//     category: "Sông nước",
//   },
//   {
//     id: 5,
//     title: "Phú Quốc Island Paradise",
//     description: "Nghỉ dưỡng tại đảo ngọc Phú Quốc với bãi biển tuyệt đẹp",
//     image: "/placeholder.svg?height=300&width=400",
//     price: 3200000,
//     originalPrice: 3800000,
//     rating: 4.9,
//     reviews: 203,
//     duration: "4 ngày 3 đêm",
//     location: "Kiên Giang",
//     maxGuests: 18,
//     category: "Biển đảo",
//     featured: true,
//   },
//   {
//     id: 6,
//     title: "Da Lat Flower City Tour",
//     description: "Khám phá thành phố ngàn hoa với khí hậu mát mẻ quanh năm",
//     image: "/placeholder.svg?height=300&width=400",
//     price: 1500000,
//     originalPrice: 1800000,
//     rating: 4.4,
//     reviews: 92,
//     duration: "2 ngày 1 đêm",
//     location: "Lâm Đồng",
//     maxGuests: 22,
//     category: "Núi rừng",
//   },
// ]

interface Tour {
  id: number;
  name: string;
  description: string;
  price: number;
  start_date: string;
  end_date: string;
  location: string;
  // các thuộc tính khác của tour
}

const categories = ["Tất cả", "Biển đảo", "Núi rừng", "Văn hóa", "Sông nước"]
const sortOptions = [
  { value: "featured", label: "Nổi bật" },
  { value: "price-low", label: "Giá thấp đến cao" },
  { value: "price-high", label: "Giá cao đến thấp" },
  { value: "rating", label: "Đánh giá cao nhất" },
]

const ToursPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [sortBy, setSortBy] = useState("featured");
  const [isOpen, setIsOpen] = useState(false);
  // const data = getListTours();
  const [tours, setTours] = useState<Tour[]>([]);


  useEffect(() => {
    fetchData();
  }, [])
  const fetchData = async () => {
    const result = await getListTours();
    setTours(result?.data || []);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  // const filteredAndSortedTours = tours
  //   .filter((tour) => {
  //     const matchesSearch =
  //       tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       tour.location.toLowerCase().includes(searchTerm.toLowerCase())
  //     const matchesCategory = selectedCategory === "Tất cả" || tour.category === selectedCategory
  //     return matchesSearch && matchesCategory
  //   })
  //   .sort((a, b) => {
  //     switch (sortBy) {
  //       case "price-low":
  //         return a.price - b.price
  //       case "price-high":
  //         return b.price - a.price
  //       case "rating":
  //         return b.rating - a.rating
  //       case "featured":
  //       default:
  //         return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
  //     }
  //   })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Khám Phá Các Tour Du Lịch</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tìm kiếm và đặt những chuyến du lịch tuyệt vời nhất tại Việt Nam
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm tour..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger onClick={() => setIsOpen(!isOpen)} className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue options={sortOptions} />
              </SelectTrigger>

              <SelectContent isOpen={isOpen}>
                {sortOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    closeDropdown={() => setIsOpen(false)} // 👈 đóng sau khi chọn
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Tìm thấy <span className="font-semibold">{tours.length}</span> tour
          </p>
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <Card key={tour.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {/* <CardHeader className="p-0 relative">
                <div className="relative h-48 w-full">
                  <Image src={tour?.image || "/placeholder.svg"} alt={tour.title} fill className="object-cover" />
                  {tour.featured && (
                    <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">Nổi bật</Badge>
                  )}
                  <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    -{Math.round(((tour.originalPrice - tour.price) / tour.originalPrice) * 100)}%
                  </div>
                </div>
              </CardHeader> */}

              <CardContent className="p-4">
                {/* <div className="mb-2">
                  <Badge variant="light" className="text-xs">
                    {tour.category}
                  </Badge>
                </div> */}

                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{tour.name}</h3>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{tour.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    {tour.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {tour.start_date} - {tour.end_date}
                  </div>
                  {/* <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    Tối đa {tour.maxGuests} người
                  </div> */}
                </div>

                {/* <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm font-medium">{tour.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500 ml-2">({tour.reviews} đánh giá)</span>
                </div> */}

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-red-600">{formatPrice(tour.price)}</span>
                    {/* <span className="text-sm text-gray-500 line-through ml-2">{formatPrice(tour.originalPrice)}</span> */}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0">
              <Link href={`/tours/${tour.id}/detail`} className="w-full">
                <Button className="w-full">Xem chi tiết</Button>
              </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {tours.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy tour nào</h3>
            <p className="text-gray-500">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
          </div>
        )}

        {/* Load More Button */}
        {tours.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="md">
              Xem thêm tour
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ToursPage
