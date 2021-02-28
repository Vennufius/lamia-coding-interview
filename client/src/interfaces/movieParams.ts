interface MovieParams {
  title: string;
  year: number | null;
  plot?: 'short' | 'full';
}

export default MovieParams;
