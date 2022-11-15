<script lang="ts">
    import { Router, Route } from "svelte-navigator";

    import { query } from "./stores";
    import { view } from "./utils/view";

    import Step1 from "./pages/Step-1.svelte";
    import Step2 from "./pages/Step-2.svelte";
    import Step3_Topics from "./pages/Step-3_Topics.svelte";
    import Step3_Hosts from "./pages/Step-3_Hosts.svelte";
    import Step3_Supervisors from "./pages/Step-3_Supervisors.svelte";
    import Breadcrumbs from "./components/utility/Breadcrumbs.svelte";
    import Debug from "./components/utility/Debug.svelte";
    import "iconify-icon";

    const programme = view(query, (q) => q.programme);
    const categories = view(query, (q) => q.categories);
    const goal = view(query, (q) => q.goal);

    let breadcrumbs: { path: string; label: string }[] = [];
    $: breadcrumbs = [
        $programme ? { path: "/", label: "Study: " + $programme.name } : null,
        $categories?.length
            ? {
                  path: "interests",
                  label:
                      "Interests: " + $categories.map((c) => c.name).join(", "),
              }
            : null,
        $goal ? { path: "/" + $goal, label: "Looking for: " + $goal } : null,
    ].filter((b) => !!b);
</script>

<section>
    <Router>
        <div class="container">
            <a class="title" href="/">STEERS</a>
            <Breadcrumbs items={breadcrumbs} />
            <div class="flex">
                <Debug label="State" data={{ query: $query, breadcrumbs }} />
            </div>
            <Route path="/">
                <h2 class="title is-size-4">
                    Step 1: Select your study programme
                </h2>
                <Step1 />
            </Route>
            <Route path="/interests">
                <h2 class="title is-size-4">Step 2: Choose your interests</h2>
                <Step2 />
            </Route>
            <Route path="/supervisor">
                <h2 class="title is-size-4">Step 3: Find a supervisor</h2>
                <Step3_Supervisors />
            </Route>
            <Route path="/topic">
                <h2 class="title is-size-4">Step 3: Find a topic</h2>
                <Step3_Topics />
            </Route>
            <Route path="/host">
                <h2 class="title is-size-4">Step 3: Find a host</h2>
                <Step3_Hosts />
            </Route>
        </div>
    </Router>
</section>
