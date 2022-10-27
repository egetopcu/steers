<script lang="ts">
  import { Router, Link, Route } from "svelte-navigator";
  import { query } from "./stores/query";
  import Study from "./pages/Study.svelte";
  import Categories from "./pages/Categories.svelte";
  import Supervisors from "./pages/Supervisors.svelte";
  import Hosts from "./pages/Hosts.svelte";
</script>

<section>
  <div class="container">
    <Router>
      <Route path="/start">
        <h1>Study</h1>
        <Study />
      </Route>
      <Route path="/interests">
        <h1>Interests (categories)</h1>
        <Categories />
      </Route>
      <Route path="/supervisors">
        <h1>Supervisors</h1>
        <Supervisors />
      </Route>
      <Route path="/topics">
        <h1>Topics</h1>
        n/a
      </Route>
      <Route path="/hosts">
        <h1>Hosts (Organizations)</h1>
        <Hosts />
      </Route>

      <footer>
        <h2>Query</h2>
        <code style="text-align: left;">
          <pre>{JSON.stringify($query, null, 2)}</pre>
        </code>
      </footer>
    </Router>
  </div>
</section>
