import React from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import marked from "marked";

import api from "../../lib/api";
import ArticleMeta from "../../components/article/ArticleMeta";
import RedError from "../../components/common/RedError";
import fetcher from "../../lib/utils/fetcher";
import { SERVER_BASE_URL } from "../../lib/utils/constant";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import CommentList from "../../components/comment/CommentList";

const Article = ({ articleData, articleError, isClient }) => {
  const router = useRouter();
  const {
    query: { pid },
  } = router;

  const { data, error } = useSWR(
    `${SERVER_BASE_URL}/articles/${pid}`,
    fetcher,
    { initialData: articleData }
  );
  articleData = data;
  articleError = error;

  if (!articleData) {
    return <LoadingSpinner />;
  }

  if (articleError) return <RedError message="Cannot load an article..." />;

  const { article } = articleData;

  const markup = {
    __html: marked(article.body, { sanitize: true }),
  };

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>
          <h2>{isClient ? "CSR" : "SSR"}</h2>
          <ArticleMeta article={article} />
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-xs-12">
            <div dangerouslySetInnerHTML={markup} />
            <ul className="tag-list">
              {article.tagList.map((tag) => (
                <li key={tag} className="tag-default tag-pill tag-outline">
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr />

        <div className="article-actions" />

        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            <CommentList />
          </div>
        </div>
      </div>
    </div>
  );
};

Article.getInitialProps = async ({ req, query }) => {
  if (!req) {
    return {
      isClient: true,
    };
  }
  const { pid } = query;
  const articleData = await api.Articles.get(pid);
  return {
    articleData,
    isClient: false,
  };
};

export default Article;
