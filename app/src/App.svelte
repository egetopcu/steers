<script lang="ts">
  import { Router, Route } from "svelte-navigator";
  import { query, breadcrumbs } from "./stores";
  import Breadcrumbs from "./components/Breadcrumbs.svelte";

  import Step1 from "./pages/Step-1.svelte";
  import Step2 from "./pages/Step-2.svelte";
  import Step3_Topics from "./pages/Step-3_Topics.svelte";
  import Step3_Hosts from "./pages/Step-3_Hosts.svelte";
  import Step3_Supervisors from "./pages/Step-3_Supervisors.svelte";
</script>

<section>
  <Router>
    <div class="container">
      <h1 class="title">STEERS</h1>
      <Breadcrumbs items={$breadcrumbs} />
      <Route path="/">
        <h2 class="title is-size-4">Step 1: Select your study programme</h2>
        <Step1 />
      </Route>
      <Route path="/interests">
        <h2 class="title is-size-4">Step 2: Choose your interests</h2>
        <Step2 />
      </Route>
      <Route path="/supervisors">
        <h2 class="title is-size-4">Step 3: Find a supervisor</h2>
        <Step3_Supervisors />
      </Route>
      <Route path="/topics">
        <h2 class="title is-size-4">Step 3: Find a topic</h2>
        <Step3_Topics />
      </Route>
      <Route path="/hosts">
        <h2 class="title is-size-4">Step 3: Find a host</h2>
        <Step3_Hosts />
      </Route>

      <footer>
        <h2 class="title is-size-4 mt-4 mb-0">Query</h2>
        <pre><code>{JSON.stringify($query, null, 2)}</code></pre>
      </footer>
    </div>
  </Router>
</section>
