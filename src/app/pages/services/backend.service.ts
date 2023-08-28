import { Injectable } from "@angular/core";
import { HttpHeaders,HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { ApiResult } from "src/app/shared/common.type";

@Injectable({
    providedIn: `root`,
  })
export class BackendService {
 
  private  apiVersion:string = "v1";

    constructor(private http: HttpClient) {}

    public login<ApiResult>(username:string, password:string) :Observable<any>{
      const url = `api/login`;
      return this.http.post(url,{
        username:username,
        password:password
      } );
    }
  
    public logOut<ApiResult>() :Observable<any>{
      const url = `api/logout`;
      return this.http.post(url,{});
    }

    public getAllCharts<ApiResult>(data:any):Observable<any>{
      const url = `api/resources/helm/charts`;
      return this.http.get(url,
        {
          params:data
        });
    }

    public getProjecBuildFileFromGitlab<ApiResult>(projectId:string, branchName:string) :Observable<any>{
      const url = `api/${this.apiVersion}/gitlab/project/${projectId}/file/build`;
      return this.http.get(url,
        {
          params:{
            branchName: branchName
          }
        });
    }
    
    public GetAllUserFromGitLab<ApiResult>():Observable<any>{
      const url = `api/resources/gitlab/user/all`;
      return this.http.get(url);
    }
    public getProjectListFromGitlab<ApiResult>() :Observable<any>{
      const url = `api/${this.apiVersion}/gitlab/project/list`;
      return this.http.get(url);
    }
    public getBranchListFromGitlab<ApiResult>(projectId:string,search:string) :Observable<any>{
      const url = `api/${this.apiVersion}/gitlab/project/${projectId}/branch/list`;
      return this.http.get(url,{
        params:{
          search:search
        }
      });
    }


    public getTestTemplate<ApiResult>(id:string) :Observable<any>{
      const url = `api/${this.apiVersion}/testtemplate/${id}`;
      return this.http.get(url,{
        params:{
          id:id
        }
      });
    }

    public getTestTemplateList<ApiResult>(data:any) :Observable<any>{
      const url = `api/${this.apiVersion}/testtemplate/list`;
      return this.http.get(url,{
        params:data
      });
    }

    public getTestTemplatePagedList<ApiResult>(data:any) :Observable<any>{
      const url = `api/${this.apiVersion}/testtemplate/pagedlist`;
      return this.http.get(url,{
        params:data
      });
    }
    public createTestTemplate<ApiResult>(data:any) :Observable<any>{
      const url = `api/${this.apiVersion}/testtemplate`;
      return this.http.post(url,data);
    }
    
    public updateTestTemplate<ApiResult>(id:string, data:any) :Observable<any>{
      const url = `api/${this.apiVersion}/testtemplate/${id}`;
      return this.http.put(url,data);
    } 
      public updateUnitTestTemplate<ApiResult>(id:string, data:any) :Observable<any>{
      const url = `api/${this.apiVersion}/testtemplate/${id}/unittest`;
      return this.http.put(url,data);
    }
    public deleteTestTemplate<ApiResult>(id:string) :Observable<any>{
      const url = `api/${this.apiVersion}/testtemplate/${id}`;
      return this.http.delete(url);
    }

    public getEnvironment<ApiResult>(id:string) :Observable<any>{
      const url = `api/${this.apiVersion}/envs/${id}`;
      return this.http.get(url);
    }

    public getEnvironmentList<ApiResult>(data:any) :Observable<any>{
      const url = `api/${this.apiVersion}/envs/all`;
      return this.http.get(url,{
        params:data
      });
    }
    public getEnvironmentPagedList<ApiResult>(data:any) :Observable<any>{
      const url = `api/${this.apiVersion}/envs`;
      return this.http.get(url,{
        params:data
      });
    }
    public createEnvironment<ApiResult>(data:any) :Observable<any>{
      const url = `api/${this.apiVersion}/envs`;
      return this.http.post(url,data);
    }
    
    public updateEnvironment<ApiResult>(id:string, data:any) :Observable<any>{
      const url = `api/${this.apiVersion}/envs/${id}`;
      return this.http.put(url,data);
    }
    public deleteEnvironment<ApiResult>(id:string) :Observable<any>{
      const url = `api/${this.apiVersion}/envs/${id}`;
      return this.http.delete(url);
    }


    
    public getInfrastructure<ApiResult>(id:string) :Observable<any>{
      const url = `api/${this.apiVersion}/infras/${id}`;
      return this.http.get(url);
    }

    public getInfrastructureList<ApiResult>(data:any) :Observable<any>{
      const url = `api/${this.apiVersion}/infras/all`;
      return this.http.get(url,{
        params:data
      });
    }
    public getInfrastructurePagedList<ApiResult>(data:any) :Observable<any>{
      const url = `api/${this.apiVersion}/infras`;
      return this.http.get(url,{
        params:data
      });
    }
    public createInfrastructure<ApiResult>(data:any) :Observable<any>{
      const url = `api/${this.apiVersion}/infras`;
      return this.http.post(url,data);
    }
    
    public updateInfrastructure<ApiResult>(id:string, data:any) :Observable<any>{
      const url = `api/${this.apiVersion}/infras/${id}`;
      return this.http.put(url,data);
    }
    public deleteInfrastructure<ApiResult>(id:string) :Observable<any>{
      const url = `api/${this.apiVersion}/infras/${id}`;
      return this.http.delete(url);
    }


    public getPackageConfig<ApiResult>(id:string) :Observable<any>{
      const url = `api/${this.apiVersion}/packageconfig/${id}`;
      return this.http.get(url,{
        params:{
          id:id
        }
      });
    }
    public getPackageConfigDetail<ApiResult>(id:string) :Observable<any>{
      const url = `api/${this.apiVersion}/packageconfig/${id}/detail`;
      return this.http.get(url,{
        params:{
          id:id
        }
      });
    }
    
    public getPackageConfigList<ApiResult>(data:any) :Observable<any>{
      const url = `api/${this.apiVersion}/packageconfig/list`;
      return this.http.get(url,{
        params:data
      });
    }
    public createPackageConfig<ApiResult>(data:any) :Observable<any>{
      const url = `api/${this.apiVersion}/packageconfig`;
      return this.http.post(url,data);
    }
    
    public updatePackageConfig<ApiResult>(id:string, data:any) :Observable<any>{
      const url = `api/${this.apiVersion}/packageconfig/${id}`;
      return this.http.put(url,data);
    }
    public updatePackageMetadata<ApiResult>(id:string, data:any) :Observable<any>{
      const url = `api/${this.apiVersion}/packageconfig/${id}/metadata`;
      return this.http.put(url,data);
    }
  
    
    public deletePackageConfig<ApiResult>(id:string) :Observable<any>{
      const url = `api/${this.apiVersion}/packageconfig/${id}`;
      return this.http.delete(url);
    }


    public fromVersionList<ApiResult>(platformUrl:string, jobName:string):Observable<any> {
      const url = `api/${this.apiVersion}/jenkins/fromversion/list`;
      return this.http.get(url, {
        params:{
          platformUrl:platformUrl,
          jobName:jobName,
      }})
    }
    public toVersionList<ApiResult>(platformUrl:string, jobName:string):Observable<any> {
      const url = `api/${this.apiVersion}/jenkins/toversion/list`;
      return this.http.get(url, {
        params:{
          platformUrl:platformUrl,
          jobName:jobName,
      }})
    }
    public jobList<ApiResult>(platformUrl:string):Observable<any> {
      const url = `api/${this.apiVersion}/jenkins/job/list`;
      
      return this.http.get(url,{
        params:{
          platformUrl:platformUrl
        }
      });
    }
    public createBuild<ApiResult>(data:any):Observable<any> {
      const url = `api/${this.apiVersion}/triggertemplate`;
      return this.http.post(url,data);
    }
    public build<ApiResult>(id:string, data:any):Observable<any> {
      const url = `api/${this.apiVersion}/buildPipeline/${id}/build`;
      return this.http.post(url,data);
    }
    
    public buildList<ApiResult>(data:any) :Observable<any>{
      const url = `api/${this.apiVersion}/triggertemplate/list`;
      return this.http.get(url,{
        params:data
      });
    }
    public deleteBuild<ApiResult>(id:string):Observable<any> {
      const url = `api/${this.apiVersion}/triggertemplate/${id}`;
      return this.http.delete(url,{
        params:{
          id:id
        }
      });
    }

    public getBuild<ApiResult>(id:string) :Observable<any>{
      const url = `api/${this.apiVersion}/triggertemplate/${id}`;
      return this.http.get(url,{
        params:{
          id:id
        }
      });
    }
    public buildHistoryList<ApiResult>(data:any) :Observable<any>{
      const url = `api/${this.apiVersion}/buildHistory/list`;
      return this.http.get(url,{
        params:data
      });
    }

    public createApplication<ApiResult>(data:any):Observable<any> {
        const url = `api/${this.apiVersion}/apps`;
        return this.http.post(url,data);
      }
      public updateApplication<ApiResult>(id:string, data:any):Observable<any> {
        const url = `api/${this.apiVersion}/apps/${id}`;
        return this.http.put(url,data);
      }
      
      public deleteApplication<ApiResult>(applicationId: string) :Observable<any>{
        const url = `api/${this.apiVersion}/apps/${applicationId}`;
        return this.http.delete(url);
      }
      public applicationList<ApiResult>(data:any):Observable<any> {
        const url = `api/${this.apiVersion}/apps`;
        
        return this.http.get(url,{
          params:data
        });
      }

      public getApplication<ApiResult>(id:string):Observable<any> {
        const url = `api/${this.apiVersion}/apps/${id}`;
        return this.http.get(url);
      }

      public publishApp<ApiResult>(data:any):Observable<any> {
        const url = `api/${this.apiVersion}/app-templates/publish`;
        return this.http.post(url,data);
      }

      public getPublishHistoryList<ApiResult>(templateId:string, data:any):Observable<any> {
        const url = `api/${this.apiVersion}/app-releases/historys/${templateId}`;
        return this.http.get(url,{
          params:data
        });
      }

      
      public getPublishHistoryPageList<ApiResult>(appId:string, data:any):Observable<any> {
        const url = `api/${this.apiVersion}/app-releases/${appId}`;
        return this.http.get(url,{
          params:data
        });
      }

      public groupList<ApiResult>(data:any):Observable<any> {
        const url = `api/${this.apiVersion}/gitlab/groups/list`;
        return this.http.get(url,{
          params:data
        });
      }
      
      public projectBranchList<ApiResult>(data:any):Observable<any> {
        const url = `api/${this.apiVersion}/gitlab/project/branch/list`;
        return this.http.get(url,{
          params:data
        });
      }
      public projectList<ApiResult>(data:any):Observable<any> {
        const url = `api/${this.apiVersion}/gitlab/project/list`;
        return this.http.get(url);
      }


    public createProduct<ApiResult>(data:any):Observable<any>  {
        const url = `api/${this.apiVersion}/product`;
        return this.http.post(url,data);
      }
      
      public deleteProduct<ApiResult>(productId: string):Observable<any> {
        const url = `api/${this.apiVersion}/product/${productId}`;
        return this.http.delete(url);
      }

      public productAll<ApiResult>() :Observable<any>{
        const url = `api/${this.apiVersion}/product/all`;
        return this.http.get(url);
      }

      public productList<ApiResult>(data:any) :Observable<any>{
        const url = `api/${this.apiVersion}/product/list`;
        return this.http.get(url,{
          params:data
        });
      }

      public createProductVersion<ApiResult>(data:any):Observable<any>  {
        const url = `api/${this.apiVersion}/productversion`;
        return this.http.post(url,data);
      }
      public getProductVersion<ApiResult>(templateId: string):Observable<any> {
        const url = `api/${this.apiVersion}/productversion/${templateId}`;
        return this.http.get(url);
      }

      public productVersionList<ApiResult>(data:any) :Observable<any>{
        const url = `api/${this.apiVersion}/productversion/list`;
        return this.http.get(url,{
          params:data
        });
      }

      public getTemplate<ApiResult>(id:string):Observable<any> {
        const url = `api/${this.apiVersion}/app-templates/${id}`;
        return this.http.get(url);
      }

      public createTemplate<ApiResult>(data:any):Observable<any> {
        const url = `api/${this.apiVersion}/app-templates`;
        return this.http.post(url,data);
      }
      public updateTemplate<ApiResult>(id:string, data:any):Observable<any> {
        const url = `api/${this.apiVersion}/app-templates/${id}`;
        return this.http.put(url,data);
      }

      public deleteTemplate<ApiResult>(templateId:string):Observable<any> {
        const url = `api/${this.apiVersion}/app-templates/${templateId}`;
        return this.http.delete(url);
      }
      public getTemplateDetail<ApiResult>(templateId: string):Observable<any> {
        const url = `api/${this.apiVersion}/app-templates/${templateId}/detail`;
        return this.http.get(url);
      }
      public templateList<ApiResult>(data:any):Observable<any>{
        const url = `api/${this.apiVersion}/app-templates`;
        return this.http.get(url,{params:data});
      }
      
      public createAppTemplateService<ApiResult>(data:any):Observable<any> {
        const url = `api/${this.apiVersion}/app-services`;
        return this.http.post(url,data);
      }
      public updateAppTemplateService<ApiResult>(id:string, data:any):Observable<any> {
        const url = `api/${this.apiVersion}/app-services/${id}`;
        return this.http.put(url,data);
      }

      public getAppTemplateService<ApiResult>(id: string):Observable<any> {
        const url = `api/${this.apiVersion}/app-services/${id}`;
        return this.http.get(url);
      }
      public getAppTemplateServiceList<ApiResult>(templateId: string):Observable<any>{
        const url = `api/${this.apiVersion}/app-services`;
        return this.http.get(url,{
          params:{
            template_id:templateId,
          }
        });
      }

      public deleteAppTemplateService<ApiResult>(id: string):Observable<any>{
        const url = `api/${this.apiVersion}/app-services/${id}`;
        return this.http.delete(url);
      }

}