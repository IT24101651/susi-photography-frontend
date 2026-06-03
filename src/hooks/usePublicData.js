import { useQuery } from '@tanstack/react-query'
import {
  getSlides, getPortfolioAll, getPortfolioPreview, getPortfolioByCategory, getCategories,
  getPackages, getPackagesByCategory, getAbout, getTeam, getTestimonials, getSettings,
} from '../api/endpoints'

export const useSlides        = ()     => useQuery({ queryKey: ['slides'],             queryFn: getSlides })
export const useCategories    = ()     => useQuery({ queryKey: ['categories'],         queryFn: getCategories })
export const usePortfolioAll  = ()     => useQuery({ queryKey: ['portfolio-all'],      queryFn: getPortfolioAll })
export const usePortfolioPreview = ()  => useQuery({ queryKey: ['portfolio-preview'],  queryFn: getPortfolioPreview })
export const usePortfolioByCategory = (slug) => useQuery({ queryKey: ['portfolio-cat', slug], queryFn: () => getPortfolioByCategory(slug), enabled: !!slug })
export const usePackages      = ()     => useQuery({ queryKey: ['packages'],           queryFn: getPackages })
export const usePackagesByCategory = (slug) => useQuery({ queryKey: ['packages-cat', slug], queryFn: () => getPackagesByCategory(slug), enabled: !!slug })
export const useAbout         = ()     => useQuery({ queryKey: ['about'],              queryFn: getAbout,        retry: false })
export const useTeam          = ()     => useQuery({ queryKey: ['team'],               queryFn: getTeam })
export const useTestimonials  = ()     => useQuery({ queryKey: ['testimonials'],       queryFn: getTestimonials })
export const useSettings      = ()     => useQuery({ queryKey: ['settings'],           queryFn: getSettings })
