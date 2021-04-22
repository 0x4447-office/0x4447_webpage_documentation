<template>
  <div class="cloud-formation">
    <a
      target="_blank"
      :href="$attrs['deploy-url']"
    >
      <img
        src="https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png"
        alt="CloudFormation"
      >
    </a>

    <p>
      We provide a complementary CloudFormation file. Click the orange button to deploy the stack. If you want to
      check the CloudFormation yourself, follow
      <a :href="$attrs['cloud-formation-url']" target="_blank">this link</a>).
      Using our CF will allow you to deploy the stack with minimal work on your part. But, if you'd like to deploy the
      stack by hand, from this point on you'll find the manual on how to do so.
    </p>
  </div>
</template>

<style>
.cloud-formation {
  display: flex;
  align-items: center;
}

.cloud-formation > a {
  flex-shrink: 0;
  margin-right: 20px;
}

@media (max-width: 768px) {
  .cloud-formation {
    display: block;
  }
}
</style>
