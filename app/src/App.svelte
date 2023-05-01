<script lang="ts">
    import { Router, Route } from "svelte-navigator";
    import { query, debug } from "./stores";

    import Step1 from "./pages/Step-1.svelte";
    import Step2 from "./pages/Step-2.svelte";
    import Step3_Topics from "./pages/Step-3_Topics.svelte";
    import Step3_Hosts from "./pages/Step-3_Hosts.svelte";
    import Step3_Supervisors from "./pages/Step-3_Supervisors.svelte";
    import Debug from "./components/utility/Debug.svelte";
    import Navigation from "./components/Navigation.svelte";
    import "iconify-icon";
</script>

<div id="toggle-debug">
    <button
        class="button"
        on:click={() => ($debug = !$debug)}
        class:is-danger={$debug}><iconify-icon icon="mdi:bug" /></button
    >
</div>

<section>
    <Router>
        <div class="container">
            <a class="title" href="/">STEERS</a>
            <!-- <Breadcrumbs items={breadcrumbs} /> -->
            <Navigation />
            <div class="flex">
                <Debug label="State" data={{ query: $query }} />
            </div>
            <Route path="/">
                <!-- <h2 class="title is-size-4">
                    Step 1: Select your study programme
                </h2> -->
                <Step1 />
            </Route>
            <Route path="/interests">
                <!-- <h2 class="title is-size-4">Step 2: Choose your interests</h2> -->
                <Step2 />
            </Route>
            <Route path="/supervisor">
                <!-- <h2 class="title is-size-4">Step 3: Find a supervisor</h2> -->
                <Step3_Supervisors />
            </Route>
            <Route path="/topic">
                <!-- <h2 class="title is-size-4">Step 3: Find a topic</h2> -->
                <Step3_Topics />
            </Route>
            <Route path="/host">
                <!-- <h2 class="title is-size-4">Step 3: Find a host</h2> -->
                <Step3_Hosts />
            </Route>
        </div>
    </Router>
</section>

<style lang="less">
    #toggle-debug {
        position: fixed;
        top: 1em;
        right: 1em;
    }

    :global(body, html) {
        background: #f3f3f3;
    }
</style>
