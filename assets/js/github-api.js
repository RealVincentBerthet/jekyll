import { Octokit } from "https://cdn.skypack.dev/@octokit/rest";

class GithubAPI{
    
    constructor(token) {        
        this.octokit = new Octokit({
            auth: token,
        });
    }

    /**
     * Return the current user logged
     * @return logged user
     */
    async getUser(){
        return await this.octokit.request("/user");
    }

    /**
     * Get a repository for a given user
     * https://developer.github.com/v3/repos/#get-a-repository
     * @param {strin} owner GitHub owner of the repository
     * @param {string} repository GitHub repository name
     */
    async getRepository(owner, repo){
        return await this.octokit.repos.get({
            owner,
            repo,
        });
    }

    /**
     * Get all public repository for a given user
     * https://developer.github.com/v3/repos/#list-repositories-for-a-user
     * @param {string} username GitHub username
     */
    async getPublicRepositories(username){
        return await this.octokit.request("GET /users/:username/repos",{
            username,   
        }); 
    }

    async getLatestCommit(owner,repo,ref){
        const response = await this.octokit.git.getRef({
            owner,
            repo,
            ref,
        });
        const commitSha = response.data.object.sha;
        const commit = await this.octokit.git.getCommit({
        owner,
        repo,
        commit_sha: commitSha,
        });
        return commit;
    }
    
    /**
     * Upload files to a defined github repository branch
     * https://octokit.github.io/rest.js/v18#repos-create-or-update-file-contents
     * @param {string} owner owner of the repository
     * @param {string} repo repository name
     * @param {string} ref branch endpoint (heads/master)
     * @param {data} treeArray use following syntax : 
     * tree=[
        { path: 'file1.txt', mode: '100644', content: 'content1' },
        { path: 'file2.txt', mode: '100644', content: 'content2' }
      ]
     * The file mode; one of 100644 for file (blob), 100755 for executable (blob), 040000 for subdirectory (tree), 160000 for submodule (commit), or 120000 for a blob that specifies the path of a symlink.
     * @param {string} message  commit message
     * @param {string} author {optionnal} Default: the authenticated user. Otherwise use : {name:"MYNAME",email:"MYNAME@MYMAIL.com"}
     * @param {string} committer  {optionnal} Default: the authenticated user. Otherwise use : {name:"MYNAME",email:"MYNAME@MYMAIL.com"}
     * @return commit pushed response
     */
    async uploadToRepository(owner,repo, ref="heads/master", treeArray, message, author,committer){
        // getting latest commit sha and treeSha
        let response = await this.getLatestCommit(owner,repo, ref);
        const latestCommitSha=response.data.sha;
        const treeSha=response.data.tree.sha;
        
        // creating tree (100644 for blob)
        response = await this.octokit.git.createTree({
            owner,
            repo,
            base_tree: treeSha,
            tree: treeArray,
        });
        const newTreeSha = response.data.sha;

        // git commit
        response = await this.octokit.git.createCommit({
            owner,
            repo,
            author,
            committer,
            message,
            tree: newTreeSha,
            parents: [latestCommitSha]  ,
        });
        const newCommitSha=response.data.sha;

        // git push
        response=await this.octokit.git.updateRef({
            owner,
            repo,
            ref,
            sha: newCommitSha,
        });

        return response;
    }

    /**
     * Get all public repository for a given user
     * https://developer.github.com/v3/repos/#list-repositories-for-a-user
     * @param {string} username GitHub username
     */
    async getPublicRepositories(username){
        return await this.octokit.request("GET /users/:username/repos",{
            username,   
        }); 
    }

    /**
     * Get the contents of the repository's license file, if one is detected.
     * https://developer.github.com/v3/licenses/#get-the-license-for-a-repository
     * @param {strin} owner GitHub owner of the repository
     * @param {string} repository GitHub repository name
     */
    async getLicense(owner,repo){
        return await this.octokit.licenses.getForRepo({
            owner,
            repo,
        });
    }

    /**
     * Get the tags for a given repository
     * https://developer.github.com/v3/git/tags/#get-a-tag
     * @param {strin} owner GitHub owner of the repository
     * @param {string} repo GitHub repository name
     */
    async getListTags(owner,repo){
        return await this.octokit.repos.listTags({
            owner,
            repo,
        });
    }

    /**
     * Get a list of release for a given repository
     * https://developer.github.com/v3/repos/releases/#list-releases
     * @param {strin} owner GitHub owner of the repository
     * @param {string} repository GitHub repository name
     */
    async getListReleases(owner,repository){
        return await this.octokit.repos.listReleases({
            owner,
            repo,
        });;
    }

    /**
     * Get a published release with the specified tag
     * https://developer.github.com/v3/repos/releases/#get-a-release-by-tag-name
     * @param {strin} owner GitHub owner of the repository
     * @param {string} repo GitHub repository name
     * @param {string} release_id Tag of the release
     */
    async getRelease(owner,repo,release_id){
        return await this.octokit.repos.getRelease({
            owner,
            repo,
            release_id,
        });
    }

    /**
     * Geet the latest published full release for the repository
     * https://developer.github.com/v3/repos/releases/#get-the-latest-release
     * @param {strin} owner GitHub owner of the repository
     * @param {string} repo GitHub repository name
     */
    async getLatestRelease(owner,repo){
        return await this.octokit.repos.getLatestRelease({
            owner,
            repo,
        });
    }

    /**
     * Gets the contents of a file or directory for a given repository
     * https://developer.github.com/v3/repos/contents/#get-repository-content
     * @param {strin} owner GitHub owner of the repository
     * @param {string} repo GitHub repository name
     * @param {string} path File path or directory 
     */
    async getContent(owner,repo,path){
        return await this.octokit.repos.getContent({
            owner,
            repo,
            path,
        });
    }

    /**
     * Gets the preferred README for a repository
     * https://developer.github.com/v3/repos/contents/#get-a-repository-readme
     * @param {strin} owner GitHub owner of the repository
     * @param {string} repo GitHub repository name
     */
    async getReadme(owner,repo){
        return await this.octokit.getReadme({
            owner,
            repo,
          });
    }

    /**
     * Lists languages for the specified repository. The value shown for each language is the number of bytes of code written in that language.
     * https://developer.github.com/v3/repos/#list-repository-languages
     * @param {strin} owner GitHub owner of the repository
     * @param {string} repo GitHub repository name
     * @param {boolean} percent Get percent instead of bytes 
     */
    async getLanguages(owner,repo,percent=false){

        return await this.octokit.repos.listLanguages({
            owner,
            repo,
          }).then(function (data){
            if(percent){
                let sum=0;
                for(let i in data){
                    sum+=data[i];
                }

                for(let i in data){
                    data[i]=Math.round((data[i]/sum)*10000)/100;
                }
            }
            return data;
        });
    }

    /**
     * Lists contributors for the specified repository.
     * https://developer.github.com/v3/repos/#list-repository-contributors
     * @param {strin} owner GitHub owner of the repository
     * @param {string} repo GitHub repository name
     */
    async getContributors(owner,repo){
        return this.octokit.repos.listContributors({
            owner,
            repo,
        });
    }

}

async function main(){

    let github=new GithubAPI("07c7524220de4a2ef29ad6ad807660fc0013b4a2"); //@TODO hide key
    const owner="RealVincentBerthet";
    const repository="jekyll";
    const ref="heads/test";
    const tree=[
        { path: 'file1.txt', mode: '100644', content: 'file content here' },
        { path: 'file.txt', mode: '100644', content: 'bravoezrzerzre file content here' }
    ]
    const message='alller message';
    //const u=await github.getUser();
    //console.log(u);
    const r=await github.getRepository(owner,repository);
    console.log(r);
    //console.warn(await github.uploadToRepository(owner, repository,ref,tree,message));
}

main(); //@TODO VOIR EXPORT et IMPORT MODULE pour fichier séparé