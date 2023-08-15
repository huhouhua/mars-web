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
      const url = `auth/login`;
      return this.http.post(url,{
        username:username,
        password:password
      } );
    }
  
    public logOut<ApiResult>() :Observable<any>{
      const url = `auth/logout`;
      return this.http.post(url,{});
    }

    public getProjecBuildFileFromGitlab<ApiResult>(projectId:string, branchName:string) :Observable<any>{
      const url = `${this.apiVersion}/gitLab/project/${projectId}/file/build`;
      return this.http.get(url,
        {
          params:{
            branchName: branchName
          }
        });
    }
    
    public GetAllUserFromGitLab<ApiResult>():Observable<any>{
      const url = `${this.apiVersion}/gitLab/user/all`;
      return this.http.get(url);
    }
    public getProjectListFromGitlab<ApiResult>() :Observable<any>{
      const url = `${this.apiVersion}/gitLab/project/list`;
      return this.http.get(url);
    }
    public getBranchListFromGitlab<ApiResult>(projectId:string,search:string) :Observable<any>{
      const url = `${this.apiVersion}/gitLab/project/${projectId}/branch/list`;
      return this.http.get(url,{
        params:{
          search:search
        }
      });
    }


    public getTestTemplate<ApiResult>(id:string) :Observable<any>{
      const url = `${this.apiVersion}/testtemplate/${id}`;
      return this.http.get(url,{
        params:{
          id:id
        }
      });
    }

    public getTestTemplateList<ApiResult>(data:any) :Observable<any>{
      const url = `${this.apiVersion}/testtemplate/list`;
      return this.http.get(url,{
        params:data
      });
    }

    public getTestTemplatePagedList<ApiResult>(data:any) :Observable<any>{
      const url = `${this.apiVersion}/testtemplate/pagedlist`;
      return this.http.get(url,{
        params:data
      });
    }
    public createTestTemplate<ApiResult>(data:any) :Observable<any>{
      const url = `${this.apiVersion}/testtemplate`;
      return this.http.post(url,data);
    }
    
    public updateTestTemplate<ApiResult>(id:string, data:any) :Observable<any>{
      const url = `${this.apiVersion}/testtemplate/${id}`;
      return this.http.put(url,data);
    } 
      public updateUnitTestTemplate<ApiResult>(id:string, data:any) :Observable<any>{
      const url = `${this.apiVersion}/testtemplate/${id}/unittest`;
      return this.http.put(url,data);
    }
    public deleteTestTemplate<ApiResult>(id:string) :Observable<any>{
      const url = `${this.apiVersion}/testtemplate/${id}`;
      return this.http.delete(url);
    }


    public getPackageConfig<ApiResult>(id:string) :Observable<any>{
      const url = `${this.apiVersion}/packageconfig/${id}`;
      return this.http.get(url,{
        params:{
          id:id
        }
      });
    }
    public getPackageConfigDetail<ApiResult>(id:string) :Observable<any>{
      const url = `${this.apiVersion}/packageconfig/${id}/detail`;
      return this.http.get(url,{
        params:{
          id:id
        }
      });
    }
    public getPackageConfigList<ApiResult>(data:any) :Observable<any>{
      const url = `${this.apiVersion}/packageconfig/list`;
      return this.http.get(url,{
        params:data
      });
    }
    public createPackageConfig<ApiResult>(data:any) :Observable<any>{
      const url = `${this.apiVersion}/packageconfig`;
      return this.http.post(url,data);
    }
    
    public updatePackageConfig<ApiResult>(id:string, data:any) :Observable<any>{
      const url = `${this.apiVersion}/packageconfig/${id}`;
      return this.http.put(url,data);
    }
    public updatePackageMetadata<ApiResult>(id:string, data:any) :Observable<any>{
      const url = `${this.apiVersion}/packageconfig/${id}/metadata`;
      return this.http.put(url,data);
    }
  
    
    public deletePackageConfig<ApiResult>(id:string) :Observable<any>{
      const url = `${this.apiVersion}/packageconfig/${id}`;
      return this.http.delete(url);
    }


    public fromVersionList<ApiResult>(platformUrl:string, jobName:string):Observable<any> {
      const url = `${this.apiVersion}/jenkins/fromversion/list`;
      return this.http.get(url, {
        params:{
          platformUrl:platformUrl,
          jobName:jobName,
      }})
    }
    public toVersionList<ApiResult>(platformUrl:string, jobName:string):Observable<any> {
      const url = `${this.apiVersion}/jenkins/toversion/list`;
      return this.http.get(url, {
        params:{
          platformUrl:platformUrl,
          jobName:jobName,
      }})
    }
    public jobList<ApiResult>(platformUrl:string):Observable<any> {
      const url = `${this.apiVersion}/jenkins/job/list`;
      
      return this.http.get(url,{
        params:{
          platformUrl:platformUrl
        }
      });
    }
    public createBuild<ApiResult>(data:any):Observable<any> {
      const url = `${this.apiVersion}/triggertemplate`;
      return this.http.post(url,data);
    }
    public build<ApiResult>(id:string, data:any):Observable<any> {
      const url = `${this.apiVersion}/buildPipeline/${id}/build`;
      return this.http.post(url,data);
    }
    
    public buildList<ApiResult>(data:any) :Observable<any>{
      const url = `${this.apiVersion}/triggertemplate/list`;
      return this.http.get(url,{
        params:data
      });
    }
    public deleteBuild<ApiResult>(id:string):Observable<any> {
      const url = `${this.apiVersion}/triggertemplate/${id}`;
      return this.http.delete(url,{
        params:{
          id:id
        }
      });
    }

    public getBuild<ApiResult>(id:string) :Observable<any>{
      const url = `${this.apiVersion}/triggertemplate/${id}`;
      return this.http.get(url,{
        params:{
          id:id
        }
      });
    }
    public buildHistoryList<ApiResult>(data:any) :Observable<any>{
      const url = `${this.apiVersion}/buildHistory/list`;
      return this.http.get(url,{
        params:data
      });
    }

    public createApplication<ApiResult>(data:any):Observable<any> {
        const url = `${this.apiVersion}/application`;
        return this.http.post(url,data);
      }
      
      public deleteApplication<ApiResult>(applicationId: string) :Observable<any>{
        const url = `${this.apiVersion}/application/${applicationId}`;
        return this.http.delete(url);
      }
      public applicationList<ApiResult>(data:any):Observable<any> {
        const url = `${this.apiVersion}/application/list`;
        
        return this.http.get(url,{
          params:data
        });
      }

      public getApplication<ApiResult>(id:string):Observable<any> {
        const url = `${this.apiVersion}/application/${id}`;
        return this.http.get(url);
      }

      public groupList<ApiResult>(data:any):Observable<any> {
        const url = `${this.apiVersion}/gitlab/groups/list`;
        return this.http.get(url,{
          params:data
        });
      }
      
      public projectBranchList<ApiResult>(data:any):Observable<any> {
        const url = `${this.apiVersion}/gitlab/project/branch/list`;
        return this.http.get(url,{
          params:data
        });
      }
      public projectList<ApiResult>(data:any):Observable<any> {
        const url = `${this.apiVersion}/gitlab/project/list`;
        return this.http.get(url);
      }


    public createProduct<ApiResult>(data:any):Observable<any>  {
        const url = `${this.apiVersion}/product`;
        return this.http.post(url,data);
      }
      
      public deleteProduct<ApiResult>(productId: string):Observable<any> {
        const url = `${this.apiVersion}/product/${productId}`;
        return this.http.delete(url);
      }

      public productAll<ApiResult>() :Observable<any>{
        const url = `${this.apiVersion}/product/all`;
        return this.http.get(url);
      }

      public productList<ApiResult>(data:any) :Observable<any>{
        const url = `${this.apiVersion}/product/list`;
        return this.http.get(url,{
          params:data
        });
      }

      public createProductVersion<ApiResult>(data:any):Observable<any>  {
        const url = `${this.apiVersion}/productversion`;
        return this.http.post(url,data);
      }
      public getProductVersion<ApiResult>(templateId: string):Observable<any> {
        const url = `${this.apiVersion}/productversion/${templateId}`;
        return this.http.get(url);
      }

      public productVersionList<ApiResult>(data:any) :Observable<any>{
        const url = `${this.apiVersion}/productversion/list`;
        return this.http.get(url,{
          params:data
        });
      }

      public createTemplate<ApiResult>(data:any):Observable<any> {
        const url = `${this.apiVersion}/template`;
        return this.http.post(url,data);
      }
      
      public getTemplate<ApiResult>(templateId: string):Observable<any> {
        const url = `${this.apiVersion}/template/${templateId}`;
        return this.http.get(url);
      }
      public templateList<ApiResult>(data:any):Observable<any>{
        const url = `${this.apiVersion}/template/list`;
        return this.http.get(url,{params:data});
      }
      
      public createTemplateConfig<ApiResult>(data:any):Observable<any> {
        const url = `${this.apiVersion}/templateconfig`;
        return this.http.post(url,data);
      }
      
      public getTemplateConfig<ApiResult>(templateId: string):Observable<any> {
        const url = `${this.apiVersion}/templateconfig/${templateId}`;
        return this.http.get(url);
      }
      public templateConfigList<ApiResult>( templateId: string):Observable<any>{
        const url = `${this.apiVersion}/templateconfig/${templateId}/list`;
        return this.http.get(url);
      }

}