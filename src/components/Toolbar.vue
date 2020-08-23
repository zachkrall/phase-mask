<template>
  <div id="toolbar">
    <h1>
      <Logo />
      Phase Mask
    </h1>
    <div>
      <div
        :class="
          state.camera === true ? 'status--green' : 'status--red'
        "
      >
        Camera
      </div>
      <div
        :class="state.mic === true ? 'status--green' : 'status--red'"
      >
        Microphone
      </div>
      <div
        :class="state.tfjs === true ? 'status--green' : 'status--red'"
      >
        Model
      </div>
      <div
        :class="state.face === true ? 'status--green' : 'status--red'"
      >
        Face Visible
      </div>
    </div>
  </div>
</template>

<script>
import Logo from '../assets/logo.svg'

export default {
  components: { Logo },
  computed: {
    state() {
      return this.$store.state
    }
  }
}
</script>

<style scoped>
#toolbar {
  position: fixed;
  top: 0.5em;
  left: 0.5em;
  width: calc(100% - 1em);
  padding: 0.5rem;
  flex-shrink: 0;
  flex-grow: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 500;
  background: hsla(0, 0%, 0%, 0.8);
  color: #fff;
  border-radius: 0.25em;
}
#toolbar >>> svg {
  height: 2em;
  width: 2em;
  margin-right: 0.2em;
}

#toolbar h1 {
  font-size: inherit;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  letter-spacing: -0.05em;
  font-weight: 500;
}
#toolbar button {
  display: block;
  background: #fff;
  color: #000;
  border-radius: 0.25em;
  border-width: 0px;
  padding: 0.4em 0.7em;
  font-size: inherit;

  appearance: none;
}
#toolbar button:hover {
  display: block;
  background: #000;
  color: #fff;
  border-radius: 0.25em;
  border-width: 0px;
  padding: 0.4em 0.7em;
  font-size: inherit;
}
#toolbar button:active {
  background: #00f;
}

#toolbar div,
#toolbar button {
  margin-right: 0.25em;
}

#toolbar div[class^='status'] {
  color: #fff;
  font-family: sans-serif;
  display: inline-flex;
  align-items: center;
  border-radius: 0.25em;
  border-width: 0px;
  padding: 0.4em 0.5em 0.35em 0.5em;
  font-size: 0.9em;
}
#toolbar div.status--red {
  color: tomato;
}
#toolbar div.status--red::before {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  content: ' ';
  display: inline-block;
  margin-right: 0.25em;
  background-color: tomato;
}
#toolbar div.status--green {
  color: #76ed56;
}
#toolbar div.status--green::before {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  content: ' ';
  display: inline-block;
  margin-right: 0.25em;
  background-color: #76ed56;
}
</style>
