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
      We provide a complementary CloudFormation file. Before you click the orange
      button to deploy the stack, make sure to <a :href="$attrs['product-url']" target="_blank">subscribe first</a>
      to the product on the AWS Marketplace, and if you want to
      check the CloudFormation yourself, follow
      <a :href="$attrs['cloud-formation-url']" target="_blank">this link</a>.
      Using our CF will allow you to deploy the stack with minimal work on your part. But, if you'd like to deploy the
      stack by hand, from this point on you'll find the manual on how to do so.
    </p>
  </div>
</template>

<style>
.cloud-formation {
  display: flex;
}

.cloud-formation > a {
  flex-shrink: 0;
  margin-right: 20px;
  margin-top: 1em;
  display: block;
}

@media (max-width: 768px) {
  .cloud-formation {
    display: block;
  }
}
</style>
