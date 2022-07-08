<script lang="ts">
import { session, page } from "$app/stores";

import { onMount } from "svelte";


$: shouldNavigate = ($page.routeId !== "sign-in" && $page.routeId !== "sign-up");

  onMount(async () => {
    session.set({});
    console.log($page.routeId)
    if(shouldNavigate) {
      window.location.href = '/sign-in'
    }
  })
</script>