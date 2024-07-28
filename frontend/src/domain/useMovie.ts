import useSWR from "swr";
import axios from 'axios'
import { useToast } from "@/components/ui/use-toast"
import { API_URL } from '@/config/common'
import queryString from 'query-string';


export default function useMovie() {
  const { toast } = useToast()

  const movieDetail = (videoId: string) => {

  }

  const searchVideo = ({ filters }) => {
    console.log('params', filters);
    filters.offset = filters.page * filters.limit;
    const { data, error, isValidating, isLoading } = useSWR(`${API_URL}/videos?${queryString.stringify(filters)}`, axios)
    console.log('searchVideo', { data, error, isValidating, isLoading });
    return { data, error, isValidating, isLoading };
  }

  const shareMovie = async (url: string) => {
    const result = await axios.post(`${API_URL}/videos/share-video`, {
      url: url
    })

    console.log('result', result)
    return result.data.data;
  }

  return {
    movieDetail,
    shareMovie,
    searchVideo
  }

}

