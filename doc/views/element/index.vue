<template >
  <div class="html-element">
    <h2>内容分区</h2>
    <details open>
      <summary>The first elment is address</summary>
      <address>
        <ul>
          <li>
            当表示一个和联系信息无关的任意的地址时，请改用
            <code>&lt;p&gt;</code> 元素而不是
            <code>&lt;address&gt;</code> 元素。
          </li>
          <li>
            这个元素不能包含除联系信息之外的任何信息，比如出版日期（这应当被包含在
            <code>&lt;time&gt;</code> 元素之中）。
          </li>
          <li>
            通常，
            <code>&lt;address&gt;</code> 元素可以放在
            <code>&lt;footer&gt;</code> 元素之中（如果存在的话）。
          </li>
        </ul>
      </address>
    </details>

    <details open>
      <summary>The second elment is articel</summary>
      <article>
        <section>
          可包含多个
          <code>&lt;section&gt;</code> 元素
        </section>
        <footer>
          <time
            title="可以使用&lt;time&gt;元素的datetime属性来描述&lt;article&gt;元素的发布日期和时间。请注意 &lt;time&gt;的pubdate 属性不再是W3C HTML5标准。"
            datetime="2019-11-18"
          >2019-11-18</time>
        </footer>
      </article>
    </details>

    <details open>
      <summary>HTML &lt;aside&gt; 元素表示一个和其余页面内容几乎无关的部分，被认为是独立于该内容的一部分并且可以被单独的拆分出来而不会使整体受影响。其通常表现为侧边栏或者标注框（call-out boxes）。</summary>
      <article>
        <p>
          迪斯尼电影
          <cite>海的女儿</cite>（
          <cite>The Little Mermaid</cite>）于 1989 年首次登上银幕。
        </p>
        <aside>在首次发行期间，该片便收获了 8700 万美元的票房。</aside>
        <p>更多有关该电影的信息…</p>
      </article>
    </details>

    <details open>
      <summary>blockquote</summary>
      <blockquote cite="海的女儿">
        <p>可使用cite属性表示这段文字来自哪里</p>
      </blockquote>
    </details>

    <details open>
      <summary>figure</summary>
      <figure>
        <img src="doc/assets/elephant-660-480.jpg"
            alt="Elephant at sunset">
        <figcaption>An elephant at sunset</figcaption>
    </figure>
    </details>

    <details open>
      <summary>mark</summary>
        <p>&lt;mark&gt;用于<mark>高亮</mark>文本</p>
    </details>
  </div>
</template>
<script>
export default {};
</script>
<style lang="less">
@import "../../assets/styles/element.less";
</style>   