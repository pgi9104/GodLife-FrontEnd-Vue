<script setup lang="ts">
import BaseModal from '@/components/common/modal/BaseModal.vue'
const modalId = 'loginModal';

const showModal = () => {
  (document.getElementById(modalId) as HTMLDivElement).style.display="block";
};

const hideModal=() => {
  (document.getElementById(modalId) as HTMLDivElement).style.display="none";
};

</script>

<template>
<!-- Button to open the modal login form -->
<button v-on:click="showModal" >Login</button>

<!-- The Modal -->
<div :id=modalId class="modal">
  <!-- Modal Content -->
  <form class="modal-content animate" action="/action_page.php">
    <span v-on:click="hideModal" class="close" title="Close Modal">&times;</span>
    <div class="imgcontainer">
      <img src="@/assets/logo.svg" alt="Avatar" class="avatar">
    </div>

    <div class="container">
      <label for="uname"><b>Username</b></label>
      <input type="text" placeholder="Enter Username" name="uname" required>

      <label for="psw"><b>Password</b></label>
      <input type="password" placeholder="Enter Password" name="psw" required>

      <button type="submit">Login</button>
      <label>
        <input type="checkbox" checked="true" name="remember"> Remember me
      </label>
    </div>

    <div class="container" style="background-color:#f1f1f1">
      <button type="button" class="cancelbtn" v-on:click="hideModal">Cancel</button>
      <span class="psw">Forgot <a href="#">password?</a></span>
    </div>
  </form>
</div>
</template>

<style>
/* Extra style for the cancel button (red) */
.modal .cancelbtn {
  width: auto;
  padding: 10px 18px;
  background-color: #f44336;
}

/* Center the avatar image inside this container */
.modal .imgcontainer {
  text-align: center;
  margin: 24px 0 12px 0;
}

/* Avatar image */
.modal img.avatar {
  width: 20%;
  border-radius: 50%;
}


/* The "Forgot password" text */
.modal span.psw {
  float: right;
  padding-top: 16px;
}

/* Change styles for span and cancel button on extra small screens */
@media screen and (max-width: 300px) {
  .modal span.psw {
    display: block;
    float: none;
  }
  .modal .cancelbtn {
    width: 100%;
  }
}
</style>