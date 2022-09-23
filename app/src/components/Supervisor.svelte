<script lang="ts">
    export let label: string;

    let details: {
        name: string,
        displayName: string,
        givenName: string,
        jobtitle: string,
        mail: string,
        phoneWork: string,
        profileUrl: string,
        pictureUrl: string,
        researchUrl: string,

        organizations: {
            department: string,
            section: string
        }[]

        locations: {
            location: string
        }[]
    } | undefined;

    async function update_people_details(label: string) {
        let response = await fetch(`https://people.utwente.nl/peoplepagesopenapi/contacts?query=${encodeURIComponent(label)}`)
        let data = await response.json()

        console.log({data});
        
        if (data?.data && data.data.length >= 1) {
            console.log(data.data[0])
            details = data.data[0];
        }
    }

    $: update_people_details(label);
</script>

<div class="person">
    {#if details}
        <div class="cards">
            <div class="photo"><img src={details.pictureUrl} alt={details.name}/></div>
            <div class="content">
                <div class="name">{details.name} ({details.givenName})</div>
                <div class="jobtitle">{details.jobtitle}</div>
                <div class="contact">
                    <div class="mail">{details.mail}</div>
                    <div class="phone">{details.phoneWork}</div>
                    <div class="profile"><a href={details.profileUrl}>{details.profileUrl}</a></div>
                    <div class="office">{details.locations.map(l => l.location).join(", ")}</div>
                </div>
            </div>
        </div>
    {/if}
</div>