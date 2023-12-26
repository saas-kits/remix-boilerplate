import type {
  MetaDescriptor,
  MetaFunction,
} from "@remix-run/node";

export const getDefaultSeoTags = (baseUrl: string) => {
  return {
    title: "Root Layout tags",
    description: "Root Layout tags",
    openGraph: {
      url: `${baseUrl}/robots.txt`,
      title: "Robots.txt",
      description: "Robots.txt",
      images: [
        {
          url: `${baseUrl}/static/images/seo/seo.png`,
          alt: "Robots.txt",
          height: 630,
          width: 1200,
        },
      ],
    },
  };
};


/**
 * How to user mergeMeta function
 * https://gist.github.com/ryanflorence/ec1849c6d690cfbffcb408ecd633e069#file-usage-ts
 */

export const mergeMeta = (
  overrideFn: MetaFunction,
  appendFn?: MetaFunction
): MetaFunction => {
  return (arg) => {
    // get meta from parent routes
    let mergedMeta = arg.matches.reduceRight((acc, match) => {
      if (match.meta.length > 0 && acc.length == 0)
        return acc.concat(match.meta || []);
      return acc;
    }, [] as MetaDescriptor[]);

    // replace any parent meta with the same name or property with the override
    let overrides = overrideFn(arg);
    for (let override of overrides) {
      let index = mergedMeta.findIndex(
        (meta) =>
          ("name" in meta &&
            "name" in override &&
            meta.name === override.name) ||
          ("property" in meta &&
            "property" in override &&
            meta.property === override.property) ||
          ("title" in meta && "title" in override)
      );
      if (index !== -1) {
        mergedMeta.splice(index, 1, override);
      }
    }

    // append any additional meta
    if (appendFn) {
      mergedMeta = mergedMeta.concat(appendFn(arg));
    }

    return mergedMeta;
  };
};
