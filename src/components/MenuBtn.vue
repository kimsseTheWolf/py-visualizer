<script setup>

</script>
<template>
<div class="menu-button">
    <slot></slot>
</div>
</template>
<style>
.menu-button {
  margin-right: 5px;
  padding: 5px;
  border-radius: 5px;
  width: fit-content;
  height: fit-content;
  cursor: pointer;
  transition: all 0.1s;
  font-size: 15px;
}
.menu-button:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>