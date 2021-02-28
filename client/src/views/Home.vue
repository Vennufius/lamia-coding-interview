<template>
  <div class="home">
    <div>
      <h3>Get movie</h3>
      <input v-model="title" type="text" placeholder="Title" required />
      <input v-model="year" type="number" placeholder="Year" />
      <select v-model="plot">
        <option>short</option>
        <option>full</option>
      </select>
      <button @click="getMovie">Submit</button>
      <div v-if="movieResults">
        <pre>{{ JSON.stringify(movieResults, null, 2) }}</pre>
      </div>
      <hr />
      <h3>Get book</h3>
      <input type="text" v-model="isbn" placeholder="Book ISBN" />
      <button @click="getBook">Submit</button>
      <div v-if="bookResults">
        <pre>{{ JSON.stringify(bookResults, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue';
import MovieParams from '@/interfaces/movieParams';
import API from '@/lib/API';

export default defineComponent({
  name: 'Home',
  setup() {
    const params: MovieParams = reactive({
      title: '',
      year: null,
      plot: 'short',
    });

    const isbn = ref('');

    const movieResults = ref(null);
    const bookResults = ref(null);

    const getMovie = async () => {
      try {
        if (!params.title) throw new Error('Title needed.');
        movieResults.value = await API.getMovie(params);
      } catch (error) {
        if (error.response) {
          console.error(error.response.data.message);
        } else {
          console.error(error);
        }
      }
    };
    const getBook = async () => {
      try {
        bookResults.value = await API.getBook(isbn.value);
      } catch (error) {
        if (error.response) {
          console.error(error.response.data.message);
        } else {
          console.error(error);
        }
      }
    };

    return {
      ...toRefs(params),
      isbn,
      movieResults,
      bookResults,
      getMovie,
      getBook,
    };
  },
});
</script>
<style scoped>
pre {
  text-align: left;
  padding: 2rem;
}
</style>
