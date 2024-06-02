<script setup lang="ts">

const modalId = 'modalSignin';

const githubLoginUrl = import.meta.env.VITE_APP_AUTH_URI+"/oauth2/authorization/github?redirect_uri="+import.meta.env.VITE_APP_SERVER_URI+"/token";

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
  <main>
    <div class="modal" tabindex="-1" role="dialog" :id=modalId>
      <div class="modal-dialog" role="document">
        <div class="modal-content rounded-4 shadow">
          <div class="modal-header p-5 pb-4 border-bottom-0">
            <span v-on:click="hideModal" class="close" title="Close Modal">&times;</span>
            <h1 class="fw-bold mb-0 fs-2">Sign up for free</h1>
          </div>

          <div class="modal-body p-5 pt-0">
            <form class="">
              <div class="form-floating mb-3">
                <input type="email" class="form-control rounded-3" id="floatingInput" placeholder="name@example.com">
                <label for="floatingInput">Email address</label>
              </div>
              <div class="form-floating mb-3">
                <input type="password" class="form-control rounded-3" id="floatingPassword" placeholder="Password">
                <label for="floatingPassword">Password</label>
              </div>
              <button class="w-100 mb-2 btn btn-lg rounded-3 btn-primary" type="submit">Sign up</button>
              <small class="text-body-secondary">By clicking Sign up, you agree to the terms of use.</small>
              <hr class="my-4">
              <h2 class="fs-5 fw-bold mb-3">Or use a third-party</h2>
              <button class="w-100 py-2 mb-2 btn btn-outline-secondary rounded-3" type="submit">
                <svg class="bi me-1" width="16" height="16"><use xlink:href="#twitter"></use></svg>
                Sign up with Twitter
              </button>
              <button class="w-100 py-2 mb-2 btn btn-outline-primary rounded-3" type="submit">
                <svg class="bi me-1" width="16" height="16"><use xlink:href="#facebook"></use></svg>
                Sign up with Facebook
              </button>
              <button class="w-100 py-2 mb-2 btn btn-outline-secondary rounded-3" type="submit">
                <svg class="bi me-1" width="16" height="16"></svg>
                <a class="oauth" :href=githubLoginUrl>Sign up with GitHub</a>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </main>
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

/* Full-width inputs */
.modal+.login input[type=text], input[type=password] {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

/* Set a style for all buttons */
.modal+.login button {
  background-color: #04AA6D;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  cursor: pointer;
  width: 100%;
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